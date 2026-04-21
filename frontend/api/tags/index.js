const { prisma } = require('../_shared/db');
const { applyCorsHeaders, handlePreflight, json } = require('../_shared/http');

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
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });

    json(res, 200, tags);
  } catch (error) {
    console.error(error);
    json(res, 500, { error: 'Internal server error' });
  }
};
