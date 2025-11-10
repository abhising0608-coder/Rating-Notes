
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // This logic runs on the client-side
    const user = localStorage.getItem('user');
    if (user) {
      router.replace('/'); // If user is logged in, stay on the dashboard (which is under the (main) group at the root)
    } else {
      router.replace('/login'); // If not logged in, redirect to login
    }
  }, [router]);

  return null; 
}
