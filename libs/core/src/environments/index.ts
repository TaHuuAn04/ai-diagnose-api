import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

export const HOST: string = process.env.HOST ?? 'localhost';
export const API_PORT: number = process.env.API_PORT
  ? parseInt(process.env.API_PORT)
  : 3001;
export const WORKER_PORT: number = process.env.WORKER_PORT
  ? parseInt(process.env.WORKER_PORT)
  : 3002;

export const LOGIN_OTP_EXPIRE_TIME: number = process.env.LOGIN_OTP_EXPIRE_TIME
  ? parseInt(process.env.LOGIN_OTP_EXPIRE_TIME)
  : 300;
export const REGISTER_OTP_EXPIRE_TIME: number = process.env
  .REGISTER_OTP_EXPIRE_TIME
  ? parseInt(process.env.REGISTER_OTP_EXPIRE_TIME)
  : 900;
export const REDIS_HOST: string = process.env.REDIS_HOST ?? 'localhost';
export const REDIS_PORT: number = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT)
  : 6378;
export const REDIS_DB: number = process.env.REDIS_DB
  ? parseInt(process.env.REDIS_DB)
  : 0;
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD ?? '';
export const OTP_RESEND_TIME: number = process.env.OTP_RESEND_TIME
  ? parseInt(process.env.OTP_RESEND_TIME)
  : 300;

// novu
export const NOVU_SERVER_URL: string = process.env.NOVU_SERVER_URL ?? '';
export const NOVU_API_KEY: string = process.env.NOVU_API_KEY ?? '';

// Template name
export const INTERNAL_WORKER_API_URL: string =
  process.env.INTERNAL_WORKER_API_URL ?? '';

// dify
export const DIFY_ALLOWED_PLUGINS: string =
  process.env.DIFY_ALLOWED_PLUGINS ?? '';

// API Base URL
export const API_BASE_URL: string = process.env.API_BASE_URL ?? '';
