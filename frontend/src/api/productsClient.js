import { requestJson } from './httpClient';

const productListCache = new Map();
const PRODUCT_LIST_CACHE_MS = 30000;

function makeCacheKey(params) {
  return JSON.stringify({
    search: params.search || '',
    category: params.category || '',
    condition: params.condition || '',
    sort: params.sort || '',
    page: params.page || 1,
    limit: params.limit || '',
  });
}

function clearProductListCache() {
  productListCache.clear();
}

export async function listProducts(params = {}) {
  const cacheKey = makeCacheKey(params);
  const cached = productListCache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < PRODUCT_LIST_CACHE_MS) {
    return cached.data;
  }

  const usp = new URLSearchParams();
  if (params.search) usp.set('search', params.search);
  if (params.category) usp.set('category', params.category);
  if (params.condition) usp.set('condition', params.condition);
  if (params.sort) usp.set('sort', params.sort);
  if (params.page) usp.set('page', String(params.page));
  if (params.limit) usp.set('limit', String(params.limit));
  const qs = usp.toString();
  const data = await requestJson(`/api/products${qs ? `?${qs}` : ''}`);
  productListCache.set(cacheKey, { createdAt: Date.now(), data });
  return data;
}

export async function getProduct(id) {
  return requestJson(`/api/products/${encodeURIComponent(id)}`);
}

export async function createProduct(payload) {
  const data = await requestJson('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  clearProductListCache();
  return data;
}

export async function updateProduct(id, payload) {
  const data = await requestJson(`/api/products/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  clearProductListCache();
  return data;
}
