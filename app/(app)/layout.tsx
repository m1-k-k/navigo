import { BottomNav } from "@/components/app/bottom-nav";
import { Sidebar } from "@/components/app/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
