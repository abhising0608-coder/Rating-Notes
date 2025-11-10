
'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import CareEdgeLogo from '@/components/CareEdgeLogo';
import { getUsers } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { User } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleLogin = async () => {
    setError('');
    if (!selectedUserId) {
      setError('Please select a user to log in.');
      return;
    }
    
    const user = users.find(u => u.id === selectedUserId);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/');
    } else {
      setError('Selected user not found. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <CareEdgeLogo />
          </div>
          <CardTitle className="font-headline">Welcome to CREST</CardTitle>
          <CardDescription>Select a user profile to sign in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="user-select">Select User Role</Label>
            <Select onValueChange={setSelectedUserId} value={selectedUserId}>
                <SelectTrigger id="user-select">
                    <SelectValue placeholder="Select a user..."/>
                </SelectTrigger>
                <SelectContent>
                    {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                           {user.name} ({user.role})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
