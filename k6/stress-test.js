import { check, sleep } from 'k6';
import http from 'k6/http';

import { BASE_URL, JSON_HEADERS } from './config.js';

export const options = {
  stages: [
    { duration: '3m', target: 20 },
    { duration: '5m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.10'],
  },
};

export default function () {
  const rand = Math.random();

  if (rand < 0.7) {
    const res = http.get(`${BASE_URL}/doctors?page=1&take=10`, { headers: JSON_HEADERS });
    check(res, { 'status 200': (r) => r.status === 200 });
  } else {
    const res = http.get(`${BASE_URL}/shifts`, { headers: JSON_HEADERS });
    check(res, { 'status 200': (r) => r.status === 200 });
  }

  sleep(0.3);
}
