const { getPool } = require('../_shared/db');
const { applyCorsHeaders, handlePreflight, json } = require('../_shared/http');

function resolveId(req) {
  if (typeof req.query?.id === 'string') {
    return req.query.id;
  }

  const path = (req.url || '').split('?')[0];
  return path.split('/').filter(Boolean).pop();
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

  const id = resolveId(req);
  if (!id) {
    json(res, 400, { error: 'Validation failed', details: { fieldErrors: { id: ['Required'] } } });
    return;
  }

  try {
    const pool = getPool();
    const productResult = await pool.query(
      `SELECT id, "name", "shortDescription", "longDescription" FROM "Product" WHERE id = $1 LIMIT 1`,
      [id],
    );

    const product = productResult.rows[0];

    if (!product) {
      json(res, 404, { error: 'Product not found' });
      return;
    }

    const [mediasResult, tagsResult, linksResult] = await Promise.all([
      pool.query(
        `
          SELECT id, "productId", url, type, "aspectRatio", "order"
          FROM "Media"
          WHERE "productId" = $1
          ORDER BY "order" ASC
        `,
        [id],
      ),
      pool.query(
        `
          SELECT t.id, t."name"
          FROM "ProductTag" pt
          INNER JOIN "Tag" t ON t.id = pt."tagId"
          WHERE pt."productId" = $1
          ORDER BY t."name" ASC
        `,
        [id],
      ),
      pool.query(
        `
          SELECT id, "productId", platform, url
          FROM "AffiliateLink"
          WHERE "productId" = $1
          ORDER BY platform ASC
        `,
        [id],
      ),
    ]);

    json(res, 200, {
      id: product.id,
      name: product.name,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      medias: mediasResult.rows.map((media) => ({
        id: media.id,
        productId: media.productId,
        url: media.url,
        type: media.type,
        aspectRatio: media.aspectRatio,
        order: media.order,
      })),
      tags: tagsResult.rows,
      affiliateLinks: linksResult.rows.map((link) => ({
        id: link.id,
        productId: link.productId,
        platform: link.platform,
        url: link.url,
      })),
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === 'DATABASE_URL is not configured') {
      json(res, 500, { error: 'Database is not configured' });
      return;
    }
    json(res, 500, { error: 'Internal server error' });
  }
};
