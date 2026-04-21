const { getPool } = require('../_shared/db');
const { applyCorsHeaders, handlePreflight, json } = require('../_shared/http');
const { getFallbackProducts } = require('../_shared/store-fallback');

const allowedSort = new Set(['recent', 'name_asc', 'name_desc']);

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

module.exports = async function handler(req, res) {
  if (handlePreflight(req, res)) {
    return;
  }

  applyCorsHeaders(req, res);

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    json(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const pool = getPool();
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
    const tagsRaw = typeof req.query.tags === 'string' ? req.query.tags : '';
    const tags = tagsRaw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const sortInput = typeof req.query.sort === 'string' ? req.query.sort : 'recent';
    const sort = allowedSort.has(sortInput) ? sortInput : 'recent';
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = Math.min(parsePositiveInt(req.query.pageSize, 12), 50);

    const params = [];
    const whereClauses = [];

    if (search) {
      params.push(`%${search}%`);
      whereClauses.push(`p."name" ILIKE $${params.length}`);
    }

    if (tags.length > 0) {
      params.push(tags);
      whereClauses.push(
        `EXISTS (SELECT 1 FROM "ProductTag" pt WHERE pt."productId" = p.id AND pt."tagId" = ANY($${params.length}::text[]))`,
      );
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const orderBySql =
      sort === 'name_asc' ? `p."name" ASC` : sort === 'name_desc' ? `p."name" DESC` : `p."createdAt" DESC`;

    const countQuery = `SELECT COUNT(*)::int AS total FROM "Product" p ${whereSql}`;
    const countResult = await pool.query(countQuery, params);
    const totalCount = countResult.rows[0]?.total ?? 0;

    const listParams = [...params];
    listParams.push(pageSize);
    const limitParam = listParams.length;
    listParams.push((page - 1) * pageSize);
    const offsetParam = listParams.length;

    const listQuery = `
      SELECT
        p.id,
        p."name",
        p."shortDescription",
        (
          SELECT m.url
          FROM "Media" m
          WHERE m."productId" = p.id
            AND m.type = 'IMAGE'
          ORDER BY m."order" ASC
          LIMIT 1
        ) AS "mainImage",
        COALESCE(
          json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t."name"))
            FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) AS tags
      FROM "Product" p
      LEFT JOIN "ProductTag" pt ON pt."productId" = p.id
      LEFT JOIN "Tag" t ON t.id = pt."tagId"
      ${whereSql}
      GROUP BY p.id
      ORDER BY ${orderBySql}
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `;

    const listResult = await pool.query(listQuery, listParams);

    json(res, 200, {
      items: listResult.rows.map((item) => ({
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
        mainImage: item.mainImage,
        tags: item.tags,
      })),
      totalCount,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === 'DATABASE_URL is not configured') {
      res.setHeader('x-xavier-data-source', 'fallback');
      json(res, 200, getFallbackProducts(req.query ?? {}));
      return;
    }
    json(res, 500, { error: 'Internal server error' });
  }
};
