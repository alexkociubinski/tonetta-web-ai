import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers';
import HomeClient from "./home-client";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <HomeClient initialUser={user} />;
}
