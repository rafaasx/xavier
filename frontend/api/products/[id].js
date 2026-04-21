const { prisma } = require('../_shared/db');
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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        medias: {
          orderBy: { order: 'asc' },
        },
        productTags: {
          include: {
            tag: {
              select: { id: true, name: true },
            },
          },
        },
        affiliateLinks: true,
      },
    });

    if (!product) {
      json(res, 404, { error: 'Product not found' });
      return;
    }

    json(res, 200, {
      id: product.id,
      name: product.name,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      medias: product.medias,
      tags: product.productTags.map((productTag) => productTag.tag),
      affiliateLinks: product.affiliateLinks,
    });
  } catch (error) {
    console.error(error);
    json(res, 500, { error: 'Internal server error' });
  }
};
