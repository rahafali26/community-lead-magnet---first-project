import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client للفرونت اند — يستخدم anon key فقط.
 * بحكم RLS، هذا المفتاح مسموح له فقط بعمليات INSERT على submissions/events (بدون قراءة).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
