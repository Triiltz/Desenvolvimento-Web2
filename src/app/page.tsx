import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { HomeMapClient } from '@/components/HomeMapClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const c = await cookies();
  if (!c.get('fizy_onboarded')) redirect('/onboarding');
  if (!c.get('fizy_token')) redirect('/login');
  return <HomeMapClient />;
}
