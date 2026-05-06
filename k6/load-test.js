import { check, group, sleep } from 'k6';
import http from 'k6/http';

import {
  BASE_URL,
  JSON_HEADERS,
  TEST_EMAIL,
  TEST_PASSWORD,
  getAuthHeaders,
  thresholds,
} from './config.js';

export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '1m', target: 0 },
  ],
  thresholds,
};

function loginAndGetToken() {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    { headers: JSON_HEADERS },
  );
  if (res.status === 200 || res.status === 201) {
    return res.json()?.data?.accessToken ?? null;
  }
  return null;
}

export default function () {
  const rand = Math.random();

  if (rand < 0.60) {
    // 60%: Public endpoint - GET /doctors
    group('public - GET /doctors', () => {
      const res = http.get(`${BASE_URL}/doctors`, { headers: JSON_HEADERS });
      check(res, { 'status 200': (r) => r.status === 200 });
    });
  } else if (rand < 0.80) {
    // 20%: Public endpoint - GET /shifts
    group('public - GET /shifts', () => {
      const res = http.get(`${BASE_URL}/shifts`, { headers: JSON_HEADERS });
      check(res, { 'status 200': (r) => r.status === 200 });
    });
  } else {
    // 20%: Auth flow - login then get user info
    group('auth flow - login + user info', () => {
      if (!TEST_EMAIL || !TEST_PASSWORD) return;

      const token = loginAndGetToken();
      check({ token }, { 'login succeeded': () => token !== null });

      if (token) {
        sleep(0.3);
        const infoRes = http.get(`${BASE_URL}/users/info`, {
          headers: getAuthHeaders(token),
        });
        check(infoRes, { 'GET /users/info → 200': (r) => r.status === 200 });
      }
    });
  }

  sleep(Math.random() * 1 + 0.5);
}
