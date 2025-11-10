import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
