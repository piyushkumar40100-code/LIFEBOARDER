-- LifeBoard Demo Account Seeding Data
-- This script creates sample data for demo purposes

-- Create demo user
-- Password: Demo1234! (hashed with bcrypt, salt rounds: 12)
INSERT INTO users (id, email, password_hash, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'demo@lifeboard.app',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYcXaHqgD.sKhp2',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Seed sample goals
INSERT INTO goals (user_id, title, description, target_date, status, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Learn TypeScript', 'Complete TypeScript course and build 3 projects', '2024-12-31', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Run Marathon', 'Train for and complete first marathon', '2024-06-01', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Read 24 Books', 'Read 2 books per month throughout the year', '2024-12-31', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Build Side Project', 'Launch a profitable side project generating $1000/month', '2024-08-15', 'in_progress', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Learn Guitar', 'Master basic guitar chords and play 10 songs', '2024-09-30', 'completed', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Seed sample tasks
INSERT INTO tasks (user_id, title, description, priority, status, due_date, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Complete project proposal', 'Write and submit hackathon project proposal', 'high', 'completed', '2024-01-15', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Buy groceries', 'Get groceries for the week', 'medium', 'todo', '2024-01-10', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Call dentist', 'Schedule dental appointment for checkup', 'low', 'todo', '2024-01-20', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Review TypeScript fundamentals', 'Go through TypeScript basics course', 'medium', 'in_progress', '2024-01-25', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Plan marathon training schedule', 'Create 16-week marathon training plan', 'high', 'todo', '2024-01-18', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Seed sample habits
INSERT INTO habits (user_id, title, description, frequency, target_count, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Morning Meditation', 'Meditate for 10 minutes every morning', 'daily', 1, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Exercise', 'Work out for 30 minutes', 'daily', 1, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Read Books', 'Read for 30 minutes before bed', 'daily', 1, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Drink Water', 'Drink 8 glasses of water throughout the day', 'daily', 8, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Practice Guitar', 'Practice guitar for 20 minutes', 'weekly', 3, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Seed some habit entries
INSERT INTO habit_entries (habit_id, date, completed, notes, created_at)
SELECT
  h.id,
  CURRENT_DATE - INTERVAL '1 day',
  true,
  'Felt great and focused',
  NOW()
FROM habits h
WHERE h.user_id = '550e8400-e29b-41d4-a716-446655440001'
  AND h.title = 'Morning Meditation'
ON CONFLICT (habit_id, date) DO NOTHING;

INSERT INTO habit_entries (habit_id, date, completed, notes, created_at)
SELECT
  h.id,
  CURRENT_DATE - INTERVAL '1 day',
  true,
  '30 minutes cardio + strength training',
  NOW()
FROM habits h
WHERE h.user_id = '550e8400-e29b-41d4-a716-446655440001'
  AND h.title = 'Exercise'
ON CONFLICT (habit_id, date) DO NOTHING;

-- Seed sample finance entries
INSERT INTO finances (user_id, type, amount, category, description, date, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'income', 5000.00, 'Salary', 'Monthly salary', '2024-01-01', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'expense', 1200.00, 'Rent', 'Monthly rent payment', '2024-01-01', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'expense', 200.00, 'Groceries', 'Weekly groceries', '2024-01-05', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'expense', 150.00, 'Utilities', 'Electricity and internet bill', '2024-01-10', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'income', 500.00, 'Freelance', 'Side project income', '2024-01-15', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'expense', 50.00, 'Entertainment', 'Movies and dining out', '2024-01-20', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Seed sample health metrics
INSERT INTO health_metrics (user_id, metric_type, value, unit, date, notes, created_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Weight', 75.5, 'kg', CURRENT_DATE - INTERVAL '1 day', 'Morning weight after workout', NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Sleep', 7.5, 'hours', CURRENT_DATE - INTERVAL '1 day', 'Good quality sleep', NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Blood Pressure', 120.80, 'mmHg', CURRENT_DATE - INTERVAL '2 days', 'Normal reading', NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Steps', 8500, 'count', CURRENT_DATE - INTERVAL '1 day', 'Daily step count', NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Heart Rate', 72, 'bpm', CURRENT_DATE - INTERVAL '1 day', 'Resting heart rate', NOW())
ON CONFLICT (user_id, metric_type, date) DO NOTHING;

-- Seed sample bucket list items
INSERT INTO bucket_items (user_id, title, description, category, target_date, completed, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Visit Japan', 'Experience Japanese culture, food, and temples', 'Travel', '2025-04-01', false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Write a Book', 'Publish a fiction novel', 'Creative', '2024-12-31', false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Skydiving', 'Experience the thrill of skydiving', 'Adventure', '2024-06-15', true, '2023-11-20', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Learn a New Language', 'Become conversational in Spanish', 'Learning', '2024-09-30', false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Run a Business', 'Start and run a successful business', 'Career', '2026-01-01', false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'See Northern Lights', 'Witness the Aurora Borealis', 'Travel', '2024-12-15', false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Master Photography', 'Take professional-quality photos', 'Creative', '2024-08-30', false, NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'Volunteer Abroad', 'Help communities in developing countries', 'Service', '2025-07-01', false, NOW(), NOW())
ON CONFLICT DO NOTHING;