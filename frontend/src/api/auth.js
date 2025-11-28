import client from './client';

export async function register({name,email,password}) {
  return client.post('/api/auth/register', {name,email,password});
}
export async function login({email,password}) {
  return client.post('/api/auth/login', {email,password});
}
export async function me() {
  return client.get('/api/avatar/me' .replace('avatar','auth') );
}
