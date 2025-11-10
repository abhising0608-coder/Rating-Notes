
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LandingPage from './(main)/page';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, you might check for an existing session here.
    // For this prototype, we always start at the landing page.
  }, [router]);

  return <LandingPage />;
}
