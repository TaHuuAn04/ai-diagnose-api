-- ============================================================
-- ASTCare – Database Seed Script
-- Database: ai-api | Host: localhost | Port: 5434
-- NamingStrategy: pluralize(snakeCase(EntityName))
--
-- Cách chạy:
--   psql -h localhost -p 5434 -U postgres -d ai-api -f seeds/seed.sql
-- ============================================================

-- Xoá data cũ theo thứ tự reverse FK
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

-- ============================================================
-- 1. USERS
-- Password hash cho "Password@123" (bcrypt rounds=10)
-- ============================================================
INSERT INTO users (id, first_name, last_name, email, gender, date_of_birth, password, phone_code, phone_number, role, avatar_url, is_on_boarding_completed, created_at, updated_at)
VALUES
  -- Admin
  ('00000000-0000-0000-0000-000000000001', 'Super', 'Admin', 'admin@astcare.vn', 'MALE', '1985-01-15',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0900000001',
   'ADMIN', NULL, true, NOW(), NOW()),

  -- Doctors (4 bác sĩ)
  ('00000000-0000-0000-0000-000000000011', 'Nguyễn', 'Văn An', 'doctor.an@astcare.vn', 'MALE', '1978-03-20',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0911000001',
   'DOCTOR', 'https://i.pravatar.cc/150?img=11', true, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000012', 'Trần', 'Thị Bình', 'doctor.binh@astcare.vn', 'FEMALE', '1982-07-11',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0911000002',
   'DOCTOR', 'https://i.pravatar.cc/150?img=5', true, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000013', 'Lê', 'Minh Châu', 'doctor.chau@astcare.vn', 'FEMALE', '1980-11-05',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0911000003',
   'DOCTOR', 'https://i.pravatar.cc/150?img=9', true, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000014', 'Phạm', 'Đức Dũng', 'doctor.dung@astcare.vn', 'MALE', '1975-05-28',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0911000004',
   'DOCTOR', 'https://i.pravatar.cc/150?img=7', true, NOW(), NOW()),

  -- Admission Staff (2 nhân viên tiếp nhận)
  ('00000000-0000-0000-0000-000000000021', 'Hoàng', 'Thị Én', 'staff.en@astcare.vn', 'FEMALE', '1995-09-14',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0922000001',
   'ADMISSION STAFF', 'https://i.pravatar.cc/150?img=20', true, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000022', 'Vũ', 'Văn Phúc', 'staff.phuc@astcare.vn', 'MALE', '1993-12-30',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0922000002',
   'ADMISSION STAFF', 'https://i.pravatar.cc/150?img=15', true, NOW(), NOW()),

  -- Patients (6 bệnh nhân)
  ('00000000-0000-0000-0000-000000000031', 'Ngô', 'Thị Giang', 'patient.giang@gmail.com', 'FEMALE', '1990-02-14',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0933000001',
   'PATIENT', NULL, true, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000032', 'Đinh', 'Văn Hải', 'patient.hai@gmail.com', 'MALE', '1988-06-22',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0933000002',
   'PATIENT', NULL, true, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000033', 'Bùi', 'Thị Ích', 'patient.ich@gmail.com', 'FEMALE', '1995-04-08',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0933000003',
   'PATIENT', NULL, true, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000034', 'Lý', 'Văn Kha', 'patient.kha@gmail.com', 'MALE', '2000-08-19',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0933000004',
   'PATIENT', NULL, false, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000035', 'Mai', 'Thị Lan', 'patient.lan@gmail.com', 'FEMALE', '1997-12-01',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0933000005',
   'PATIENT', NULL, true, NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000036', 'Đặng', 'Quốc Minh', 'patient.minh@gmail.com', 'MALE', '1985-10-25',
   '$2b$10$QVQ7KvMj7Jn8jS/dFOCrwObz93Kh7yMrj29m2M2PQze.uFkOxNcAa', '+84', '0933000006',
   'PATIENT', NULL, true, NOW(), NOW());


-- ============================================================
-- 2. DOCTORS
-- ============================================================
INSERT INTO doctors (user_id, doctor_code, department, experience, description, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000011', 'BS-2024-001', 'Dermatology',
   '15 năm kinh nghiệm chẩn đoán và điều trị bệnh da liễu',
   'Chuyên gia về bệnh vảy nến, viêm da cơ địa và các bệnh da mãn tính', NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000012', 'BS-2024-002', 'Dermatology',
   '12 năm kinh nghiệm, chuyên về da liễu nhi khoa',
   'Bác sĩ chuyên điều trị các bệnh da ở trẻ em và người cao tuổi', NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000013', 'BS-2024-003', 'Dermatology',
   '18 năm kinh nghiệm, chuyên gia về laser và thẩm mỹ da',
   'Chuyên điều trị nám, tàn nhang, sẹo và các vấn đề thẩm mỹ da', NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000014', 'BS-2024-004', 'Dermatology',
   '20 năm kinh nghiệm, trưởng khoa Da liễu',
   'Chuyên gia đầu ngành trong chẩn đoán ung thư da và bệnh da hiếm gặp', NOW(), NOW());


-- ============================================================
-- 3. ADMISSION STAFFS
-- ============================================================
INSERT INTO admission_staffs (user_id, staff_code, department, description, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000021', 'NV-2024-001', 'Dermatology',
   'Nhân viên tiếp nhận khoa Da liễu ca sáng', NOW(), NOW()),

  ('00000000-0000-0000-0000-000000000022', 'NV-2024-002', 'Dermatology',
   'Nhân viên tiếp nhận khoa Da liễu ca chiều', NOW(), NOW());


-- ============================================================
-- 4. PATIENTS
-- ============================================================
INSERT INTO patients (user_id, folk, address, citizen_code, medical_insurance, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000031', 'Kinh', '123 Nguyễn Huệ, Q1, TP.HCM', '079123456789', 'BH-2024-001', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000032', 'Kinh', '456 Lê Lợi, Q3, TP.HCM', '079234567890', 'BH-2024-002', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000033', 'Khmer', '789 Cách Mạng Tháng 8, Q10, TP.HCM', '079345678901', NULL, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000034', 'Kinh', '321 Điện Biên Phủ, Bình Thạnh, TP.HCM', '079456789012', 'BH-2024-004', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000035', 'Hoa', '654 Phan Xích Long, Phú Nhuận, TP.HCM', '079567890123', NULL, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000036', 'Kinh', '987 Nguyễn Thị Thập, Q7, TP.HCM', '079678901234', 'BH-2024-006', NOW(), NOW());


-- ============================================================
-- 5. SHIFTS (ca làm việc – không có FK)
-- ============================================================
INSERT INTO shifts (id, "from", "to", status, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', '07:30:00+07', '09:00:00+07', 'AVAILABLE', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000002', '09:00:00+07', '10:30:00+07', 'AVAILABLE', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000003', '10:30:00+07', '12:00:00+07', 'AVAILABLE', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000004', '13:30:00+07', '15:00:00+07', 'AVAILABLE', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000005', '15:00:00+07', '16:30:00+07', 'AVAILABLE', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000006', '16:30:00+07', '18:00:00+07', 'AVAILABLE', NOW(), NOW());


-- ============================================================
-- 6. WORKING TIMES
-- Composite PK: (doctor_id, shift_id)
-- ============================================================
INSERT INTO working_times (doctor_id, shift_id, appointment_id, status, date, created_at, updated_at)
VALUES
  -- Bác sĩ An
  ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', NULL, 'BOOKED',     '2026-03-30', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000002', NULL, 'BOOKED',     '2026-03-30', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000003', NULL, 'AVAILABLE',  '2026-03-30', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004', NULL, 'AVAILABLE',  '2026-04-01', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000005', NULL, 'AVAILABLE',  '2026-04-01', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000006', NULL, 'UNAVAILABLE','2026-04-02', NOW(), NOW()),

  -- Bác sĩ Bình
  ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', NULL, 'BOOKED',     '2026-03-31', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000002', NULL, 'BOOKED',     '2026-03-31', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000004', NULL, 'AVAILABLE',  '2026-04-01', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000005', NULL, 'AVAILABLE',  '2026-04-01', NOW(), NOW()),

  -- Bác sĩ Châu
  ('00000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', NULL, 'BOOKED',     '2026-04-01', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000002', NULL, 'AVAILABLE',  '2026-04-01', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000003', NULL, 'AVAILABLE',  '2026-04-02', NOW(), NOW()),

  -- Bác sĩ Dũng
  ('00000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000004', NULL, 'BOOKED',     '2026-03-28', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000005', NULL, 'BOOKED',     '2026-03-28', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000001', NULL, 'AVAILABLE',  '2026-04-03', NOW(), NOW());


-- ============================================================
-- 7. SCHEDULES (lịch khám tổng – do staff tạo)
-- ============================================================
INSERT INTO schedules (id, admission_staff_id, date, "from", "to", room, doctor_id, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000021',
   '2026-03-30', '07:30:00+07', '12:00:00+07', 'P101', '00000000-0000-0000-0000-000000000011', NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000021',
   '2026-04-01', '13:30:00+07', '16:30:00+07', 'P101', '00000000-0000-0000-0000-000000000011', NOW(), NOW()),

  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000021',
   '2026-03-31', '07:30:00+07', '10:30:00+07', 'P102', '00000000-0000-0000-0000-000000000012', NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000022',
   '2026-04-01', '13:30:00+07', '16:30:00+07', 'P102', '00000000-0000-0000-0000-000000000012', NOW(), NOW()),

  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000022',
   '2026-04-01', '07:30:00+07', '10:30:00+07', 'P201', '00000000-0000-0000-0000-000000000013', NOW(), NOW()),

  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000022',
   '2026-03-28', '13:30:00+07', '16:30:00+07', 'P202', '00000000-0000-0000-0000-000000000014', NOW(), NOW());


-- ============================================================
-- 8. APPOINTMENTS
-- ============================================================
INSERT INTO appointments (id, description, status, patient_id, metadata, note, created_at, updated_at)
VALUES
  -- EXAMINED
  ('30000000-0000-0000-0000-000000000001', 'Nổi mẩn đỏ toàn thân sau dùng thuốc',
   'EXAMINED', '00000000-0000-0000-0000-000000000031',
   '{"appointmentType": "FOLLOW_UP"}', 'Bệnh nhân có tiền sử dị ứng penicillin',
   '2026-03-28 08:00:00+07', '2026-03-28 08:00:00+07'),

  ('30000000-0000-0000-0000-000000000002', 'Vảy nến tái phát ở vùng khuỷu tay',
   'EXAMINED', '00000000-0000-0000-0000-000000000032',
   '{"appointmentType": "FOLLOW_UP"}', NULL,
   '2026-03-28 14:00:00+07', '2026-03-28 14:00:00+07'),

  -- EXAMINING
  ('30000000-0000-0000-0000-000000000003', 'Mụn trứng cá nặng, có sẹo lõm',
   'EXAMINING', '00000000-0000-0000-0000-000000000033',
   '{"appointmentType": "NEW_PATIENT"}', NULL,
   '2026-03-30 07:45:00+07', '2026-03-30 07:45:00+07'),

  ('30000000-0000-0000-0000-000000000004', 'Viêm da cơ địa mạn tính, ngứa nhiều về đêm',
   'EXAMINING', '00000000-0000-0000-0000-000000000034',
   '{"appointmentType": "NEW_PATIENT"}', 'Đã dùng thuốc steroid 6 tháng',
   '2026-03-31 08:15:00+07', '2026-03-31 08:15:00+07'),

  -- SCHEDULED
  ('30000000-0000-0000-0000-000000000005', 'Kiểm tra nốt ruồi bất thường',
   'SCHEDULED', '00000000-0000-0000-0000-000000000035',
   '{"appointmentType": "NEW_PATIENT"}', NULL, NOW(), NOW()),

  ('30000000-0000-0000-0000-000000000006', 'Tái khám viêm da tiếp xúc',
   'SCHEDULED', '00000000-0000-0000-0000-000000000036',
   '{"appointmentType": "FOLLOW_UP"}', NULL, NOW(), NOW()),

  -- CANCELLED
  ('30000000-0000-0000-0000-000000000007', 'Ngứa da đầu mãn tính',
   'CANCELLED', '00000000-0000-0000-0000-000000000031',
   '{"appointmentType": "NEW_PATIENT"}', 'Bệnh nhân tự huỷ',
   '2026-03-20 10:00:00+07', '2026-03-20 10:00:00+07');


-- ============================================================
-- Cập nhật appointment_id vào working_times cho các slot BOOKED
-- ============================================================
UPDATE working_times
SET appointment_id = '30000000-0000-0000-0000-000000000001'
WHERE doctor_id = '00000000-0000-0000-0000-000000000014'
  AND shift_id = '10000000-0000-0000-0000-000000000004'
  AND date = '2026-03-28';

UPDATE working_times
SET appointment_id = '30000000-0000-0000-0000-000000000002'
WHERE doctor_id = '00000000-0000-0000-0000-000000000014'
  AND shift_id = '10000000-0000-0000-0000-000000000005'
  AND date = '2026-03-28';

UPDATE working_times
SET appointment_id = '30000000-0000-0000-0000-000000000003'
WHERE doctor_id = '00000000-0000-0000-0000-000000000011'
  AND shift_id = '10000000-0000-0000-0000-000000000001'
  AND date = '2026-03-30';

UPDATE working_times
SET appointment_id = '30000000-0000-0000-0000-000000000004'
WHERE doctor_id = '00000000-0000-0000-0000-000000000012'
  AND shift_id = '10000000-0000-0000-0000-000000000001'
  AND date = '2026-03-31';


-- ============================================================
-- 9. CONSULTATIONS (chỉ tạo cho EXAMINED / EXAMINING)
-- ============================================================
INSERT INTO consultations (id, appointment_id, patient_id, doctor_id, start_time, end_time, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000031',
   '00000000-0000-0000-0000-000000000014',
   '14:10:00+07', '14:40:00+07',
   '2026-03-28 14:10:00+07', '2026-03-28 14:40:00+07'),

  ('40000000-0000-0000-0000-000000000002',
   '30000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000032',
   '00000000-0000-0000-0000-000000000014',
   '15:05:00+07', '15:35:00+07',
   '2026-03-28 15:05:00+07', '2026-03-28 15:35:00+07'),

  ('40000000-0000-0000-0000-000000000003',
   '30000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000033',
   '00000000-0000-0000-0000-000000000011',
   '07:50:00+07', NULL,
   '2026-03-30 07:50:00+07', '2026-03-30 07:50:00+07'),

  ('40000000-0000-0000-0000-000000000004',
   '30000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000034',
   '00000000-0000-0000-0000-000000000012',
   '08:20:00+07', NULL,
   '2026-03-31 08:20:00+07', '2026-03-31 08:20:00+07');


-- ============================================================
-- 10. DIAGNOSIS RESULTS (cho consultation đã EXAMINED)
-- ============================================================
INSERT INTO diagnosis_results (id, advices, prescription, description, symstoms_text, feed_back_a_i, consultation_id, created_at, updated_at)
VALUES
  ('50000000-0000-0000-0000-000000000001',
   'Tránh tiếp xúc với thuốc kháng sinh nhóm penicillin. Dùng antihistamine để giảm ngứa.',
   '[{"name":"Cetirizine 10mg","dosage":"1 viên/ngày","duration":"7 ngày"},{"name":"Betamethasone cream","dosage":"Bôi 2 lần/ngày","duration":"5 ngày"}]',
   'Dị ứng thuốc kháng sinh nhóm beta-lactam, biểu hiện ngoài da',
   'Nổi mẩn đỏ toàn thân, ngứa dữ dội sau 2 giờ uống thuốc, không sốt',
   'AI đề xuất: Urticaria cấp tính do dị ứng thuốc. Độ chính xác cao.',
   '40000000-0000-0000-0000-000000000001',
   '2026-03-28 14:40:00+07', '2026-03-28 14:40:00+07'),

  ('50000000-0000-0000-0000-000000000002',
   'Dưỡng ẩm da thường xuyên. Tránh stress. Tái khám sau 1 tháng.',
   '[{"name":"Methotrexate 2.5mg","dosage":"3 viên/tuần","duration":"12 tuần"},{"name":"Kem dưỡng ẩm Cetaphil","dosage":"Dùng hàng ngày","duration":"Dài hạn"}]',
   'Vảy nến mảng mức độ trung bình, khu trú ở khuỷu tay và đầu gối',
   'Vảy trắng bong tróc ở khuỷu tay phải, ngứa, đã dùng thuốc bôi 2 tuần không khỏi',
   'AI đề xuất: Psoriasis Vulgaris. Cần phân biệt với seborrheic dermatitis.',
   '40000000-0000-0000-0000-000000000002',
   '2026-03-28 15:35:00+07', '2026-03-28 15:35:00+07');


-- ============================================================
-- VERIFY – Kiểm tra số lượng records đã insert
-- ============================================================
SELECT 'users'             AS table_name, COUNT(*) AS total FROM users
UNION ALL SELECT 'doctors',           COUNT(*) FROM doctors
UNION ALL SELECT 'admission_staffs',  COUNT(*) FROM admission_staffs
UNION ALL SELECT 'patients',          COUNT(*) FROM patients
UNION ALL SELECT 'shifts',            COUNT(*) FROM shifts
UNION ALL SELECT 'working_times',     COUNT(*) FROM working_times
UNION ALL SELECT 'schedules',         COUNT(*) FROM schedules
UNION ALL SELECT 'appointments',      COUNT(*) FROM appointments
UNION ALL SELECT 'consultations',     COUNT(*) FROM consultations
UNION ALL SELECT 'diagnosis_results', COUNT(*) FROM diagnosis_results
ORDER BY table_name;
