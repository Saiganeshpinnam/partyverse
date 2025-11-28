import client from './client';
export async function saveAvatar(data) {
  return client.post('/api/avatar', data);
}
export async function getMe() {
  return client.get('/api/avatar/me');
}
