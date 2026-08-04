"use client";

import Link from "next/link";
import Image from "next/image";

import { Mail, Phone, MapPin } from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/klogo.png"
                alt="Logo"
                width={55}
                height={55}
                className="rounded-lg"
              />

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Kalinga Computer Education
                </h2>

                <p className="text-sm text-gray-500">Learn • Build • Grow</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7">
              We provide professional computer education with practical training
              in Web Development, Python, Java, AI, Tally, Graphic Design, DCA,
              PGDCA and many more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>

            <div className="space-y-3">
              <Link href="/" className="block hover:text-blue-600">
                Home
              </Link>

              <Link href="/about" className="block hover:text-blue-600">
                About
              </Link>

              <Link href="/contact" className="block hover:text-blue-600">
                Contact
              </Link>

              <Link href="/login" className="block hover:text-blue-600">
                Login
              </Link>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
              Popular Courses
            </h3>

            <div className="space-y-3">
              <p>Full Stack Development</p>
              <p>React.js & Next.js</p>
              <p>Python Programming</p>
              <p>Java Programming</p>
              <p>Artificial Intelligence</p>
              <p>Tally Prime</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
              Contact Us
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 text-blue-600" size={20} />
                <p>
                  Athagarh, Cuttack,
                  <br />
                  Odisha - 754029
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-green-600" size={20} />
                <p>+91 9876543210</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-red-500" size={20} />
                <p>info@kalingacomputer.com</p>
              </div>
            </div>

            {/* Social Icons */}
            {/* Social Icons */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-blue-600 p-3 text-white transition duration-300 hover:scale-110"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-pink-600 p-3 text-white transition duration-300 hover:scale-110"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-red-600 p-3 text-white transition duration-300 hover:scale-110"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-10 border-t border-gray-300 pt-6 text-center dark:border-gray-800">
          <p className="text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">Kalinga Computer Education</span>.
            All Rights Reserved.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Designed & Developed with ❤️ using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
