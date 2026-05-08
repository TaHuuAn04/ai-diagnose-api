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

/**
 * Load test — mô phỏng traffic thực tế của hệ thống đặt lịch khám bệnh.
 *
 * Kịch bản:
 *   70% — GET /doctors  (người dùng ẩn danh tìm kiếm bác sĩ — công việc đọc chính)
 *   20% — GET /shifts   (người dùng ẩn danh xem ca làm việc)
 *   10% — GET /users/info (người dùng đã đăng nhập xem thông tin cá nhân)
 *
 * Token được lấy 1 lần duy nhất trong setup() thay vì login lại mỗi iteration,
 * phản ánh đúng hành vi thực tế: user login 1 lần, dùng token trong suốt session.
 *
 * Stages: ramp-up dần để quan sát hành vi hệ thống tại mỗi mức tải.
 */
export const options = {
  stages: [
    { duration: '2m', target: 20 },   // warm-up
    { duration: '3m', target: 50 },   // tăng tải trung bình
    { duration: '5m', target: 100 },  // tăng lên peak load
    { duration: '5m', target: 100 },  // duy trì peak load (steady state)
    { duration: '2m', target: 0 },    // cool-down
  ],
  thresholds,
};

export function setup() {
  if (!TEST_EMAIL || !TEST_PASSWORD) return { token: null };

  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    { headers: JSON_HEADERS },
  );

  const token = (res.status === 200 || res.status === 201)
    ? (res.json()?.data?.accessToken ?? null)
    : null;

  return { token };
}

export default function (data) {
  const rand = Math.random();

  if (rand < 0.70) {
    group('GET /doctors', () => {
      const res = http.get(`${BASE_URL}/doctors?page=1&take=10`, { headers: JSON_HEADERS });
      check(res, { 'GET /doctors → 200': (r) => r.status === 200 });
    });
  } else if (rand < 0.90) {
    group('GET /shifts', () => {
      const res = http.get(`${BASE_URL}/shifts`, { headers: JSON_HEADERS });
      check(res, { 'GET /shifts → 200': (r) => r.status === 200 });
    });
  } else if (data.token) {
    group('GET /users/info', () => {
      const res = http.get(`${BASE_URL}/users/info`, {
        headers: getAuthHeaders(data.token),
      });
      check(res, { 'GET /users/info → 200': (r) => r.status === 200 });
    });
  }

  sleep(Math.random() * 1 + 0.5);
}
