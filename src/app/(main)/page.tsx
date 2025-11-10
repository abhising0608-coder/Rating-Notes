
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CareEdgeLogo from '@/components/CareEdgeLogo';

export default function LandingPage() {
  const router = useRouter();

  const handleInitiate = () => {
    router.push('/notes/new');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-lg text-center shadow-2xl">
             <CardHeader>
                <div className="mx-auto mb-4">
                    <CareEdgeLogo />
                </div>
                <CardTitle className="font-headline text-3xl">CREST - Rating Note Module</CardTitle>
                <CardDescription className="text-lg">
                    A streamlined workflow for creating, managing, and finalizing rating notes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-8 text-muted-foreground">
                    Click the button below to start the rating note creation process. You will be guided through selecting a template, configuring details, and preparing the note for analysis.
                </p>
                <Button size="lg" onClick={handleInitiate} className="w-full max-w-xs mx-auto">
                    Initiate Rating Note
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
