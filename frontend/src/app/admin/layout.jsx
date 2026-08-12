import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin Panel",
  description: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      <AdminSidebar />

      <main className="flex-1 pt-16 sm:pt-0 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
