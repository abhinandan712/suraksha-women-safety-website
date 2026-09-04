const getApiUrl = (endpoint = '') => {
  if (process.env.REACT_APP_API_URL) {
    const base = process.env.REACT_APP_API_URL.replace(/\/$/, '');
    if (!endpoint) return base;
    return endpoint.startsWith('/') ? `${base}${endpoint}` : `${base}/${endpoint}`;
  }

  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    const base = 'http://localhost:5001';
    if (!endpoint) return base;
    return endpoint.startsWith('/') ? `${base}${endpoint}` : `${base}/${endpoint}`;
  }

  if (!endpoint) return '';
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
};

export default getApiUrl;
export { getApiUrl };
