-- Seed User
INSERT INTO auth.users (
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  'd0c59317-c60f-4eee-99c3-66c72ab2130c',  -- user id
  'authenticated',  -- audience
  'authenticated',  -- role
  'test@gmail.com',  -- email
  '$2a$10$xkOObi8tgDn98l0.7j30u.xnTMKXXfUDQaDJGHLYvVgh23tf6JY5.',  -- encrypted password
  '2025-01-03 16:12:06.624778+00',  -- email confirmed at
  '2025-01-03 16:12:06.620849+00',  -- created_at
  '2025-01-03 16:12:06.625074+00',  -- updated_at
  '{"provider": "email", "providers": ["email"]}',  -- raw app metadata
  '{"email_verified": true}'  -- raw user metadata
);