
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CareEdgeLogo from '@/components/CareEdgeLogo';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // In a real app, you would perform authentication here
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CareEdgeLogo />
          </div>
          <CardTitle className="font-headline">Welcome to CREST</CardTitle>
          <CardDescription>Enter any email to proceed to the dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="user@careedge.in (any email works)" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
