"use client";
import "./globals.css";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Admin pages par Navbar hide
  const hideNavbar = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        {!hideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
