import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Toaster />
    </div>
  );
}
