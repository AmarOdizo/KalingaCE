import LoginClient from "./LoginClient";

export const metadata = {
  title: "Admin Login",
  description: "Secure administrator login page for Kalinga Computer Education.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
