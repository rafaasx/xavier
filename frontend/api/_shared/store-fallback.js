const fallbackProducts = [
  {
    id: 'mvp-demo-product',
    name: 'Produto em configuracao',
    shortDescription: 'Configure BACKEND_API_BASE_URL para ativar o backend real.',
    longDescription:
      'Este produto e um fallback temporario para manter o MVP funcional enquanto o endpoint de backend nao estiver configurado.',
    tags: [{ id: 'setup', name: 'Setup' }],
  },
];

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getFallbackProducts(query) {
  const page = parsePositiveInt(query?.page, 1);
  const pageSize = Math.min(parsePositiveInt(query?.pageSize, 12), 50);
  const start = (page - 1) * pageSize;
  const items = fallbackProducts.slice(start, start + pageSize);

  return {
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      shortDescription: item.shortDescription,
      mainImage: null,
      tags: item.tags,
    })),
    totalCount: fallbackProducts.length,
    page,
    pageSize,
  };
}

function getFallbackProductById(id) {
  const item = fallbackProducts.find((product) => product.id === id);
  if (!item) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    shortDescription: item.shortDescription,
    longDescription: item.longDescription,
    medias: [],
    tags: item.tags,
    affiliateLinks: [],
  };
}

function getFallbackTags() {
  return [{ id: 'setup', name: 'Setup' }];
}

module.exports = {
  getFallbackProducts,
  getFallbackProductById,
  getFallbackTags,
};
