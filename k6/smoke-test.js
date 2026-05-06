import { check, sleep } from 'k6';
import http from 'k6/http';

import { BASE_URL, JSON_HEADERS, TEST_EMAIL, TEST_PASSWORD, thresholds } from './config.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds,
};

export default function () {
  // Public: GET /doctors
  const doctorsRes = http.get(`${BASE_URL}/doctors`, { headers: JSON_HEADERS });
  check(doctorsRes, {
    'GET /doctors → 200': (r) => r.status === 200,
    'GET /doctors → has data': (r) => r.json()?.data !== undefined,
  });

  sleep(0.5);

  // Public: GET /shifts
  const shiftsRes = http.get(`${BASE_URL}/shifts`, { headers: JSON_HEADERS });
  check(shiftsRes, {
    'GET /shifts → 200': (r) => r.status === 200,
  });

  sleep(0.5);

  // Auth: POST /auth/login
  if (TEST_EMAIL && TEST_PASSWORD) {
    const loginRes = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
      { headers: JSON_HEADERS },
    );
    check(loginRes, {
      'POST /auth/login → 200 or 201': (r) => r.status === 200 || r.status === 201,
      'POST /auth/login → has accessToken': (r) => r.json()?.data?.accessToken !== undefined,
    });
  }

  sleep(1);
}
