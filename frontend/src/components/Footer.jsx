"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Mail, Phone, MapPin, Globe } from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({
    address: "Athagarh, Cuttack, Odisha - 754029",
    phone: "+91 9876543210",
    email: "info@kalingacomputer.com",
    socialLinks: [],
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
        const url = isLocal
          ? "http://localhost:5000/api/CampusInformation"
          : "https://kalingace-4.onrender.com/api/CampusInformation";
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch contact details");
        const json = await res.json();
        const campuses = json.data || [];

        let primary = campuses.find((c) =>
          c?.campusName?.toLowerCase()?.includes("head office"),
        );
        if (!primary) {
          primary = campuses.find((c) => c.status === "Active");
        }
        if (!primary && campuses.length > 0) {
          primary = campuses[0];
        }

        if (primary) {
          const addr = `${primary.address}, ${primary.city}, ${primary.state} - ${primary.pincode}`;
          setContactInfo({
            address: addr,
            phone: primary.phone || "+91 9876543210",
            email: primary.email || "info@kalingacomputer.com",
            socialLinks: Array.isArray(primary.website) ? primary.website : [],
          });
        }
      } catch (err) {
        console.error("Error fetching footer contact details:", err);
      }
    };

    fetchContactInfo();
  }, []);

  const getSocialHelper = (type) => {
    switch (type?.toLowerCase()) {
      case "facebook":
        return {
          icon: FaFacebookF,
          hoverBg: "hover:bg-blue-600",
        };
      case "instagram":
        return {
          icon: FaInstagram,
          hoverBg: "hover:bg-pink-600",
        };
      case "youtube":
        return {
          icon: FaYoutube,
          hoverBg: "hover:bg-red-600",
        };
      case "twitter":
      case "twitter / x":
        return {
          icon: FaTwitter,
          hoverBg: "hover:bg-sky-500",
        };
      default:
        return {
          icon: Globe,
          hoverBg: "hover:bg-indigo-600",
        };
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 dark:bg-slate-950 dark:text-slate-400 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand/Company */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-white rounded-xl shadow-md shrink-0">
                <Image
                  src="/klogo.png"
                  alt="Logo"
                  width={44}
                  height={44}
                  className="rounded-lg object-contain"
                />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-white tracking-tight leading-tight">
                  Kalinga Computer Education
                </h2>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 mt-1">
                  Learn • Build • Grow
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              We provide professional computer education with practical training
              in Web Development, Python, Java, AI, Tally, Graphic Design, DCA,
              PGDCA and many more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h3>

            <div className="space-y-3 font-semibold text-xs flex flex-col items-start">
              <Link
                id="footer-nav-courses"
                href="/courses"
                className="hover:text-indigo-455 hover:translate-x-1 transition-all duration-200"
              >
                Courses
              </Link>

              <Link
                id="footer-nav-contact"
                href="/contact"
                className="hover:text-indigo-455 hover:translate-x-1 transition-all duration-200"
              >
                Contact-Us
              </Link>

              <Link
                id="footer-nav-login"
                href="/login"
                className="hover:text-indigo-455 hover:translate-x-1 transition-all duration-200"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="mb-5 text-xs font-bold text-white uppercase tracking-wider">
              Popular Courses
            </h3>

            <div className="space-y-3 font-semibold text-slate-400 text-xs flex flex-col items-start">
              <span className="hover:text-indigo-455 cursor-default hover:translate-x-1 transition-all duration-200">
                Full Stack Development
              </span>
              <span className="hover:text-indigo-455 cursor-default hover:translate-x-1 transition-all duration-200">
                React.js & Next.js
              </span>
              <span className="hover:text-indigo-455 cursor-default hover:translate-x-1 transition-all duration-200">
                Python Programming
              </span>
              <span className="hover:text-indigo-455 cursor-default hover:translate-x-1 transition-all duration-200">
                Java Programming
              </span>
              <span className="hover:text-indigo-455 cursor-default hover:translate-x-1 transition-all duration-200">
                Artificial Intelligence
              </span>
              <span className="hover:text-indigo-455 cursor-default hover:translate-x-1 transition-all duration-200">
                Tally Prime
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-bold text-white uppercase tracking-wider">
              Contact Us
            </h3>

            <div className="space-y-4 font-semibold text-slate-400 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 text-indigo-500 shrink-0" size={16} />
                <p className="whitespace-pre-line leading-relaxed">{contactInfo.address}</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-emerald-500 shrink-0" size={16} />
                <p>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="hover:underline"
                  >
                    {contactInfo.phone}
                  </a>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-rose-500 shrink-0" size={16} />
                <p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:underline"
                  >
                    {contactInfo.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {contactInfo.socialLinks.length > 0 ? (
                contactInfo.socialLinks.map((item, idx) => {
                  const helper = getSocialHelper(item?.type);
                  const Icon = helper.icon;
                  const cleanedLink = item?.link ? item.link.trim() : "";
                  if (!cleanedLink) return null;
                  const href = cleanedLink.startsWith("http")
                    ? cleanedLink
                    : `https://${cleanedLink}`;

                  return (
                    <a
                      key={idx}
                      id={`footer-social-${item?.type?.toLowerCase() || idx}`}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all ${helper.hoverBg} hover:text-white active:scale-95 cursor-pointer`}
                      title={item?.type}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })
              ) : (
                <>
                  <a
                    id="footer-social-facebook"
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-indigo-600 hover:text-white active:scale-95 cursor-pointer"
                  >
                    <FaFacebookF size={14} />
                  </a>

                  <a
                    id="footer-social-instagram"
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-pink-600 hover:text-white active:scale-95 cursor-pointer"
                  >
                    <FaInstagram size={14} />
                  </a>

                  <a
                    id="footer-social-youtube"
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-rose-600 hover:text-white active:scale-95 cursor-pointer"
                  >
                    <FaYoutube size={14} />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-[11px] font-semibold text-slate-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-400">Kalinga Computer Education</span>.
            All Rights Reserved.
          </p>

          <p className="mt-1.5 text-[9px] text-slate-600">
            Designed & Developed with ❤️ using Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
