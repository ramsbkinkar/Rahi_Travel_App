export const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'https://api.3.91.185.220.sslip.io/api';

// Derive origin by stripping trailing /api
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const withApiOrigin = (maybePath: string | undefined | null): string | undefined => {
  if (!maybePath) return undefined;
  if (maybePath.startsWith('http')) {
    try {
      const u = new URL(maybePath);
      // Rewrite any localhost/127.0.0.1 origins to the deployed API origin
      if (u.host === 'localhost:3000' || u.host === '127.0.0.1:3000') {
        return `${API_ORIGIN}${u.pathname}`;
      }
      return maybePath;
    } catch {
      // fall through to treat as path
    }
  }
  const path = maybePath.startsWith('/') ? maybePath : `/${maybePath}`;
  return `${API_ORIGIN}${path}`;
};


