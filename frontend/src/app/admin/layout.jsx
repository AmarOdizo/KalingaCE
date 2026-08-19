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
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-300">
      <AdminSidebar />

      <main className="flex-1 h-screen overflow-y-auto pt-16 sm:pt-0 min-w-0">
        {children}
      </main>
    </div>
  );
}
