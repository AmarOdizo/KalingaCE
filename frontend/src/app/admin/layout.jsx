import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin Panel",
  description: "Admin Dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 pt-16 md:pt-0 overflow-x-auto">{children}</main>
    </div>
  );
}
