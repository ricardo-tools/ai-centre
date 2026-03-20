---
name: db-supabase
description: >
  Supabase integration for Next.js projects. Covers client setup, server vs
  browser clients, Row Level Security policies, database functions, realtime
  subscriptions, file storage, Edge Functions, and migration workflow.
  Implementation skill for the database-design conceptual skill — read that
  first for schema design principles.
---

# Database — Supabase

Implementation skill for **database-design**. Read that skill first for principles on schema design, normalization, indexing, and data integrity.

---

## When to Use

Apply this skill when:
- Using Supabase as the backend platform (database + auth + storage + realtime)
- The project benefits from Row Level Security for authorization at the database level
- Realtime subscriptions are needed (live updates, collaborative features)
- File storage is needed alongside the database (Supabase Storage)
- You want a Postgres database with a managed API layer

Do NOT use this skill for:
- Neon + Drizzle ORM projects — see **db-neon-drizzle**
- Redis/caching — see **db-redis**
- Projects that only need a database without Supabase's platform features

---

## Core Rules

### 1. Install and configure Supabase clients

Use `@supabase/ssr` for Next.js (handles cookie-based auth), and `@supabase/supabase-js` as the base client.

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

The anon key is safe for the browser (RLS restricts access). The service role key bypasses RLS — server-only.

### 2. Create server and browser clients separately

**Server client** (Server Components, Server Actions, Route Handlers):

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );
}
```

**Browser client** (Client Components):

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Admin client** (server-side only, bypasses RLS):

```typescript
// src/lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### 3. Row Level Security (RLS) — the Supabase authorization model

RLS policies run at the database level. Every query through the anon key is filtered by these policies. Always enable RLS on every table.

```sql
-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read published skills
CREATE POLICY "Public can read published skills"
  ON skills FOR SELECT
  USING (status = 'published');

-- Policy: authenticated users can insert their own skills
CREATE POLICY "Users can create own skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Policy: users can update their own skills
CREATE POLICY "Users can update own skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Policy: only admins can delete
CREATE POLICY "Admins can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

### 4. Query patterns with the Supabase client

```typescript
// Select with filters
const { data: skills, error } = await supabase
  .from("skills")
  .select("*")
  .eq("is_official", true)
  .order("created_at", { ascending: false });

// Select with relations (foreign table joins)
const { data: skill } = await supabase
  .from("skills")
  .select(`
    *,
    author:users(name, email),
    versions:skill_versions(version, status, published_at)
  `)
  .eq("slug", "frontend-architecture")
  .single();

// Insert
const { data: newSkill, error } = await supabase
  .from("skills")
  .insert({
    slug: "my-skill",
    title: "My Skill",
    description: "Description",
    author_id: userId,
  })
  .select()
  .single();

// Update
const { error } = await supabase
  .from("skills")
  .update({ title: "Updated Title" })
  .eq("id", skillId);

// Delete
const { error } = await supabase
  .from("skills")
  .delete()
  .eq("id", skillId);
```

### 5. Database functions and triggers

Use Postgres functions for complex logic that should run at the database level.

```sql
-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on skills table
CREATE TRIGGER skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Call from Supabase client
const { data, error } = await supabase.rpc("my_custom_function", {
  param1: "value",
});
```

### 6. Realtime subscriptions

Subscribe to database changes in Client Components for live updates.

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LiveSkillList() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    supabase.from("skills").select("*").then(({ data }) => {
      if (data) setSkills(data);
    });

    // Subscribe to changes
    const channel = supabase
      .channel("skills-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "skills" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setSkills((prev) => [payload.new as Skill, ...prev]);
          }
          if (payload.eventType === "UPDATE") {
            setSkills((prev) =>
              prev.map((s) => (s.id === payload.new.id ? (payload.new as Skill) : s))
            );
          }
          if (payload.eventType === "DELETE") {
            setSkills((prev) => prev.filter((s) => s.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <ul>
      {skills.map((s) => (
        <li key={s.id}>{s.title}</li>
      ))}
    </ul>
  );
}
```

Enable realtime on the table in the Supabase dashboard or via SQL:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE skills;
```

### 7. File storage via Supabase Storage

Create buckets for different file types. Apply storage policies like RLS.

```typescript
// Upload
const { data, error } = await supabase.storage
  .from("project-zips")
  .upload(`${userId}/${filename}`, file, {
    contentType: "application/zip",
    upsert: false,
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from("project-zips")
  .getPublicUrl(`${userId}/${filename}`);

// Get signed URL (private bucket, time-limited)
const { data: { signedUrl } } = await supabase.storage
  .from("private-files")
  .createSignedUrl(`${userId}/${filename}`, 3600); // 1 hour

// Delete
const { error } = await supabase.storage
  .from("project-zips")
  .remove([`${userId}/${filename}`]);
```

Storage policies (SQL):

```sql
-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users upload own files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-zips' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### 8. Edge Functions

Supabase Edge Functions run on Deno. Use them for server-side logic that needs to be close to the database.

```typescript
// supabase/functions/generate-showcase/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { skillId } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // ... generate showcase logic

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

Deploy: `supabase functions deploy generate-showcase`

### 9. Migration workflow with Supabase CLI

```bash
# Install CLI
npm install -D supabase

# Initialize (creates supabase/ directory)
npx supabase init

# Start local Supabase (Docker required)
npx supabase start

# Create a new migration
npx supabase migration new create_skills_table

# Apply migrations locally
npx supabase db reset

# Push migrations to remote
npx supabase db push

# Pull remote schema changes
npx supabase db pull
```

Local development with `supabase start` gives you a full Supabase instance locally — Postgres, Auth, Storage, Realtime, and Studio — all via Docker.

### 10. Type generation

Generate TypeScript types from your database schema for type-safe queries.

```bash
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

Use in your client:

```typescript
import { Database } from "@/lib/supabase/database.types";

const supabase = createClient<Database>(url, key);

// Now fully typed
const { data } = await supabase.from("skills").select("*");
// data is typed as Database["public"]["Tables"]["skills"]["Row"][]
```

---

## Banned Patterns

- ❌ Using the service role key in browser code → use the anon key for browser clients; service role key bypasses RLS
- ❌ Disabling RLS on tables with user data → every table should have RLS enabled
- ❌ Forgetting `USING` vs `WITH CHECK` in RLS policies → `USING` filters reads, `WITH CHECK` validates writes
- ❌ Subscribing to realtime without cleaning up the channel on unmount → always call `removeChannel` in the cleanup function
- ❌ Storing `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_` variables → keep it server-only
- ❌ Using `supabaseAdmin` client from Client Components → admin client is server-only
- ❌ Skipping type generation → generate types from the database schema to keep queries typed and safe

---

## Quality Gate

Before considering Supabase integration complete:

- [ ] Server and browser clients created with proper cookie handling
- [ ] RLS enabled on every table with appropriate policies
- [ ] Supabase CLI initialized with local development working (`supabase start`)
- [ ] Migrations exist for all schema changes
- [ ] TypeScript types generated from the database schema
- [ ] Storage buckets created with RLS-like policies
- [ ] Realtime subscriptions clean up channels on component unmount
- [ ] Service role key used only in server-side code
- [ ] Environment variables follow Supabase naming conventions
- [ ] Local development works independently of the remote Supabase project
