
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardPage from './(main)/page';

export default function HomeRedirect() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  if (isLoggedIn === null) {
    return null; // Or a loading spinner
  }

  if (isLoggedIn) {
    // Render the dashboard content directly if logged in
    return <DashboardPage />;
  }

  // This part should ideally not be reached if the redirect works, but it's a fallback.
  return null;
}
