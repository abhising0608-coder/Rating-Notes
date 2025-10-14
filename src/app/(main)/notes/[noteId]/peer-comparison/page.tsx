'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import NoteNavigation from '@/components/NoteNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PeerComparisonPage() {
  return (
    <div className="flex-1 flex flex-col">
       <NoteNavigation />
       <main className="flex-1 p-8 bg-background">
         <Card>
            <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Pre-fetched Companies from Last Rating Note</AccordionTrigger>
                        <AccordionContent>
                        Placeholder for pre-fetched companies.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Query Builder to Search the Companies in the DB</AccordionTrigger>
                        <AccordionContent>
                        Placeholder for query builder functionality.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Manual Search of Companies</AccordionTrigger>
                        <AccordionContent>
                        Placeholder for manual search functionality.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>List of Selected Companies for Peer Comparison</AccordionTrigger>
                        <AccordionContent>
                        Placeholder for the list of selected companies.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
         </Card>
        </main>
         <footer className="p-4 bg-card border-t flex justify-end gap-2">
            <Button variant="outline">Reset</Button>
            <Button>Save</Button>
        </footer>
    </div>
  );
}
