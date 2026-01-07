import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers';
import HomeClient from "./home-client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Debug Logging
  console.log('[Server] Checking Auth User:', user?.id || 'No User');
  if (error) console.error('[Server] Auth Error:', error);

  // Check cookies presence
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => c.name);
  console.log('[Server] Cookies Present:', allCookies);

  return <HomeClient initialUser={user} debugInfo={{ hasUser: !!user, cookieNames: allCookies }} />;
}
