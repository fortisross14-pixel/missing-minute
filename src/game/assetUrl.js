const RAW_BASE = import.meta.env?.BASE_URL ?? '/';
const BASE_URL = RAW_BASE.endsWith('/') ? RAW_BASE : `${RAW_BASE}/`;

export function assetUrl(path) {
  const cleanPath = String(path ?? '').replace(/^\/+/, '');
  return `${BASE_URL}${cleanPath}`;
}

export { BASE_URL };
