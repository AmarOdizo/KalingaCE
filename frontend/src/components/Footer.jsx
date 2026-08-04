"use client";

import Link from "next/link";
import Image from "next/image";

import { Mail, Phone, MapPin } from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 dark:bg-slate-950 dark:text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white rounded-xl shadow-md">
                <Image
                  src="/klogo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="rounded-lg object-contain"
                />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-white tracking-tight">
                  Kalinga Computer Education
                </h2>

                <p className="text-[10px] font-bold uppercase tracking-wider text-primary-400">Learn • Build • Grow</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-400 font-medium">
              We provide professional computer education with practical training
              in Web Development, Python, Java, AI, Tally, Graphic Design, DCA,
              PGDCA and many more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-md font-bold text-white uppercase tracking-wider">
              Quick Links
            </h3>

            <div className="space-y-3 font-semibold">
              <Link href="/" className="block hover:text-primary-400 transition-colors">
                Home
              </Link>

              <Link href="/about" className="block hover:text-primary-400 transition-colors">
                About
              </Link>

              <Link href="/contact" className="block hover:text-primary-400 transition-colors">
                Contact
              </Link>

              <Link href="/login" className="block hover:text-primary-400 transition-colors">
                Login
              </Link>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="mb-5 text-md font-bold text-white uppercase tracking-wider">
              Popular Courses
            </h3>

            <div className="space-y-3 font-semibold text-slate-400">
              <p className="hover:text-primary-400 cursor-default transition-colors">Full Stack Development</p>
              <p className="hover:text-primary-400 cursor-default transition-colors">React.js & Next.js</p>
              <p className="hover:text-primary-400 cursor-default transition-colors">Python Programming</p>
              <p className="hover:text-primary-400 cursor-default transition-colors">Java Programming</p>
              <p className="hover:text-primary-400 cursor-default transition-colors">Artificial Intelligence</p>
              <p className="hover:text-primary-400 cursor-default transition-colors">Tally Prime</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-md font-bold text-white uppercase tracking-wider">
              Contact Us
            </h3>

            <div className="space-y-4 font-semibold text-slate-400 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 text-primary-500" size={18} />
                <p>
                  Athagarh, Cuttack,
                  <br />
                  Odisha - 754029
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-emerald-500" size={18} />
                <p>+91 9876543210</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-rose-500" size={18} />
                <p>info@kalingacomputer.com</p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-primary-600 hover:text-white active:scale-95 cursor-pointer"
              >
                <FaFacebookF size={16} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-pink-600 hover:text-white active:scale-95 cursor-pointer"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-red-600 hover:text-white active:scale-95 cursor-pointer"
              >
                <FaYoutube size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs font-semibold text-slate-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-400">Kalinga Computer Education</span>.
            All Rights Reserved.
          </p>

          <p className="mt-2 text-[10px] text-slate-600">
            Designed & Developed with ❤️ using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
