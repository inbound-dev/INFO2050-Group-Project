-- data.sql
-- Seed data for INFO2050 Group Project

INSERT INTO roles (role_name)
VALUES ('user'), ('admin')
ON CONFLICT (role_name) DO NOTHING;

-- Admin user
INSERT INTO users (role_id, full_name, email, password_hash, phone, is_active, failed_login_attempts)
SELECT r.role_id,
       'Jayesh Patanvadiya',
       'jayesh@gmail.com',
       '$2b$10$lkG37jLc56UsDJNERX0f9.x7r0mWgqLz4/fnTuqpXo/rx3EA1G9p6',
       NULL,
       TRUE,
       0
FROM roles r
WHERE r.role_name = 'admin'
ON CONFLICT (email) DO NOTHING;

-- Sample applicant user
INSERT INTO users (role_id, full_name, email, password_hash, phone, is_active, failed_login_attempts)
SELECT r.role_id,
       'Sample Applicant',
       'applicant@example.com',
       '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       '1234567890',
       TRUE,
       0
FROM roles r
WHERE r.role_name = 'user'
ON CONFLICT (email) DO NOTHING;

-- Sample application
INSERT INTO applications (user_id, status, bio)
SELECT u.user_id,
       'submitted',
       'Sample application row for testing.'
FROM users u
WHERE u.email = 'applicant@example.com'
  AND NOT EXISTS (
      SELECT 1 FROM applications a WHERE a.user_id = u.user_id
  );
