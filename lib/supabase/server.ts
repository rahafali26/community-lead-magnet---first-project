import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Supabase client يعمل مع جلسة تسجيل دخول الإدارة (يقرأ كوكيز الجلسة).
 * يُستخدم في middleware وصفحات /admin للتحقق من تسجيل الدخول فقط.
 */
export async function createSessionClient() {
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
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // يُستدعى أحيانًا من Server Component فقط للقراءة — يمكن تجاهله بأمان
          }
        },
      },
    }
  );
}

/**
 * Supabase client بصلاحيات كاملة (service_role) — يتجاوز RLS بالكامل.
 * يُستخدم فقط داخل API Routes على السيرفر، ولا يُصدَّر أو يُستدعى من أي كود client-side.
 * تحذير: لا تستدعي هذي الدالة إلا من ملفات app/api/**.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
