export const BASE_URL = __ENV.BASE_URL || 'https://astcare.me/api';

export const TEST_EMAIL = __ENV.K6_TEST_EMAIL || '';
export const TEST_PASSWORD = __ENV.K6_TEST_PASSWORD || '';

export const thresholds = {
  http_req_duration: ['p(95)<2000'],
  http_req_failed: ['rate<0.05'],
};

export function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const JSON_HEADERS = {
  'Content-Type': 'application/json',
};
