// DEPRECATED: This file is no longer used.
// All database operations now use Supabase via @/lib/supabase-server
// See: /supabase-setup.sql for table definitions
// See: /src/lib/supabase-server.ts for client setup
// See: /src/lib/utils-supabase.ts for camelCase conversion utilities

export { supabase as db } from './supabase-server';
