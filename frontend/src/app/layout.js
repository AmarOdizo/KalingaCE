import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";

export const metadata = {
  title: {
    default: "Kalinga Computer Education | Premium Computer & Technical Training",
    template: "%s | Kalinga Computer Education",
  },
  description:
    "Empower your career with specialized IT, computing, and professional courses at Kalinga Computer Education. Hands-on training, industry certifications, and top placement rates.",
  keywords: [
    "Computer Education",
    "Software Training",
    "Web Development",
    "Python",
    "Java",
    "Tally",
    "DCA",
    "PGDCA",
    "AI",
  ],
  authors: [{ name: "Kalinga Computer Education" }],
  creator: "Kalinga Computer Education",
  publisher: "Kalinga Computer Education",
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
