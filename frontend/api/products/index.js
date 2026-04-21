const { prisma } = require('../_shared/db');
const { applyCorsHeaders, handlePreflight, json } = require('../_shared/http');

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

    const where = {
      ...(search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(tags.length > 0
        ? {
            productTags: {
              some: {
                tagId: {
                  in: tags,
                },
              },
            },
          }
        : {}),
    };

    const orderBy =
      sort === 'name_asc' ? { name: 'asc' } : sort === 'name_desc' ? { name: 'desc' } : { createdAt: 'desc' };

    const [items, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          shortDescription: true,
          medias: {
            where: {
              type: 'IMAGE',
            },
            orderBy: {
              order: 'asc',
            },
            take: 1,
            select: {
              url: true,
            },
          },
          productTags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    json(res, 200, {
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
        mainImage: item.medias[0]?.url ?? null,
        tags: item.productTags.map((productTag) => productTag.tag),
      })),
      totalCount,
      page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    json(res, 500, { error: 'Internal server error' });
  }
};
