-- ============================================================
-- ASTCare – Reset / Rollback Seed Script
-- Run: psql -h localhost -p 5434 -U postgres -d ai-api -f seeds/reset.sql
-- ============================================================
TRUNCATE TABLE
  a_i_result_diseases,
  a_i_diagnosis_results,
  result_diseases,
  diagnosis_results,
  consultations,
  appointments,
  working_times,
  schedules,
  patients,
  doctors,
  admission_staffs,
  shifts,
  users
  CASCADE;

SELECT 'Reset complete – all tables truncated.' AS status;
