const fallbackProducts = [
  {
    id: 'mvp-demo-product',
    name: 'Produto em configuracao',
    shortDescription: 'Configure DATABASE_URL na Vercel para listar o catalogo real.',
    longDescription:
      'Este item e um fallback temporario para validar o fluxo da Store enquanto as variaveis de ambiente de banco nao estao configuradas.',
    createdAt: '2026-01-01T00:00:00.000Z',
    medias: [],
    tags: [{ id: 'setup', name: 'Setup' }],
    affiliateLinks: [],
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
  const search = typeof query.search === 'string' ? query.search.trim().toLowerCase() : '';
  const tagsRaw = typeof query.tags === 'string' ? query.tags : '';
  const tags = tagsRaw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const sort = typeof query.sort === 'string' ? query.sort : 'recent';
  const page = parsePositiveInt(query.page, 1);
  const pageSize = Math.min(parsePositiveInt(query.pageSize, 12), 50);

  let items = [...fallbackProducts];

  if (search) {
    items = items.filter((item) => item.name.toLowerCase().includes(search));
  }

  if (tags.length > 0) {
    items = items.filter((item) => item.tags.some((tag) => tags.includes(tag.id)));
  }

  if (sort === 'name_asc') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'name_desc') {
    items.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const totalCount = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);

  return {
    items: paginated.map((item) => ({
      id: item.id,
      name: item.name,
      shortDescription: item.shortDescription,
      mainImage: null,
      tags: item.tags,
    })),
    totalCount,
    page,
    pageSize,
  };
}

function getFallbackProductById(id) {
  const product = fallbackProducts.find((item) => item.id === id);
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    medias: product.medias,
    tags: product.tags,
    affiliateLinks: product.affiliateLinks,
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
