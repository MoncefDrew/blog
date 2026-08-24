/*
# Create posts table (single-tenant, no auth)

1. New Tables
- `posts`
- `id` (uuid, primary key)
- `title` (text, not null)
- `body` (text, not null)
- `author` (text, default 'anonymous')
- `created_at` (timestamp, defaults to now)

2. Security
- Enable RLS on `posts`.
- Allow anon + authenticated full CRUD because the data is intentionally public/shared (single-tenant, no auth).
- SELECT / INSERT / UPDATE / DELETE policies each scoped to `anon, authenticated`.

3. Notes
- This is a single-tenant blog with no sign-in screen; all visitors may read and write posts.
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  author text NOT NULL DEFAULT 'anonymous',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts (created_at DESC);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_posts" ON posts;
CREATE POLICY "anon_select_posts" ON posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posts" ON posts;
CREATE POLICY "anon_insert_posts" ON posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_posts" ON posts;
CREATE POLICY "anon_update_posts" ON posts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_posts" ON posts;
CREATE POLICY "anon_delete_posts" ON posts FOR DELETE
  TO anon, authenticated USING (true);
