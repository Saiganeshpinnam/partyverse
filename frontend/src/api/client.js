// simple API client using fetch
const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

async function request(path, opts = {}) {
  const headers = opts.headers || {};
  if (localStorage.getItem('token')) {
    headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
  }
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const res = await fetch(API_BASE + path, {...opts, headers});
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw {status: res.status, data};
  return data;
}

export default {
  get: (p) => request(p, {method:'GET'}),
  post: (p, body) => request(p, {method:'POST', body: JSON.stringify(body)}),
  put: (p, body) => request(p, {method:'PUT', body: JSON.stringify(body)}),
};
