import axios from 'axios';

const SESSION_STORAGE_KEY = 'ecommerce_session_id';

function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }

  return sessionId;
}

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const sessionId = getSessionId();
  config.headers['x-session-id'] = sessionId;
  return config;
});

export default client;
