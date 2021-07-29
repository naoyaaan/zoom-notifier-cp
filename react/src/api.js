import 'axios';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`
  }
});

export function updateCredential(token) {
  localStorage.setItem("token", token)
  if (token === null || token === '') {
    api.defaults.headers.common['Authorization'] = null
  } else {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export default api;
