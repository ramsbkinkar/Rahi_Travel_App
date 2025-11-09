export const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Derive origin by stripping trailing /api
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const withApiOrigin = (maybePath: string | undefined | null): string | undefined => {
  if (!maybePath) return undefined;
  if (maybePath.startsWith('http')) return maybePath;
  return `${API_ORIGIN}${maybePath}`;
};


