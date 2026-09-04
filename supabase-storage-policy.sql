-- Run this in Supabase Dashboard → SQL Editor, after creating a PUBLIC
-- bucket named "notes" (Storage → New bucket → Public bucket: ON).
--
-- Anyone can read/download files (matches the original design: files open
-- directly once a student passes the access-form gate on the notes.html
-- page). Insert/update/delete are left open at the bucket-policy level too
-- — see the security note in SETUP.md for why, and how to lock this down
-- further with a Supabase Edge Function if you want stricter enforcement.

create policy "Public read access on notes bucket"
on storage.objects for select
to public
using ( bucket_id = 'notes' );

create policy "Allow uploads to notes bucket"
on storage.objects for insert
to public
with check ( bucket_id = 'notes' );

create policy "Allow deletes on notes bucket"
on storage.objects for delete
to public
using ( bucket_id = 'notes' );
