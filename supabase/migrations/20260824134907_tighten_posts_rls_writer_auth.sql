/*
# Tighten posts RLS: public reads, writer-only writes

1. Purpose
- The blog now has a writer login (Supabase email/password auth).
- Reading posts stays public (anon + authenticated can SELECT).
- Writing posts (INSERT / UPDATE / DELETE) is restricted to authenticated writers only.

2. Security changes
- SELECT policy: unchanged, stays TO anon, authenticated USING (true) — posts are publicly readable.
- INSERT policy: changed to TO authenticated WITH CHECK (true) — only logged-in writers can create posts.
- UPDATE policy: changed to TO authenticated USING (true) WITH CHECK (true) — only logged-in writers can edit posts.
- DELETE policy: changed to TO authenticated USING (true) — only logged-in writers can delete posts.

3. Notes
- This is a multi-writer blog, not per-user isolation. Any authenticated user can write/edit/delete any post.
- The existing posts table and columns are NOT modified — only policies change.
- Existing seed posts remain readable by everyone.
*/

DROP POLICY IF EXISTS "anon_select_posts" ON posts;
CREATE POLICY "anon_select_posts" ON posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posts" ON posts;
CREATE POLICY "writer_insert_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_posts" ON posts;
CREATE POLICY "writer_update_posts" ON posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_posts" ON posts;
CREATE POLICY "writer_delete_posts" ON posts FOR DELETE
  TO authenticated USING (true);