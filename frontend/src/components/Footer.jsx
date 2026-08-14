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
        const res = await fetch("https://kalingace-4.onrender.com/api/CampusInformation");
        if (!res.ok) throw new Error("Failed to fetch contact details");
        const json = await res.json();
        const campuses = json.data || [];

        // Find primary head office campus or first active
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
          hoverBg: "hover:bg-primary-600",
        };
    }
  };

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

                <p className="text-[10px] font-bold uppercase tracking-wider text-primary-400">
                  Learn • Build • Grow
                </p>
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
              <Link
                id="footer-nav-courses"
                href="/courses"
                className="block hover:text-primary-400 transition-colors"
              >
                Courses
              </Link>

              <Link
                id="footer-nav-contact"
                href="/contact"
                className="block hover:text-primary-400 transition-colors"
              >
                Contact-Us
              </Link>

              <Link
                id="footer-nav-login"
                href="/login"
                className="block hover:text-primary-400 transition-colors"
              >
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
              <p className="hover:text-primary-400 cursor-default transition-colors">
                Full Stack Development
              </p>
              <p className="hover:text-primary-400 cursor-default transition-colors">
                React.js & Next.js
              </p>
              <p className="hover:text-primary-400 cursor-default transition-colors">
                Python Programming
              </p>
              <p className="hover:text-primary-400 cursor-default transition-colors">
                Java Programming
              </p>
              <p className="hover:text-primary-400 cursor-default transition-colors">
                Artificial Intelligence
              </p>
              <p className="hover:text-primary-400 cursor-default transition-colors">
                Tally Prime
              </p>
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
                <p className="whitespace-pre-line">{contactInfo.address}</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-emerald-500" size={18} />
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
                <Mail className="text-rose-500" size={18} />
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
            <div className="mt-6 flex flex-wrap gap-3.5">
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
                      <Icon size={16} />
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
                    className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-primary-600 hover:text-white active:scale-95 cursor-pointer"
                  >
                    <FaFacebookF size={16} />
                  </a>

                  <a
                    id="footer-social-instagram"
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-pink-600 hover:text-white active:scale-95 cursor-pointer"
                  >
                    <FaInstagram size={16} />
                  </a>

                  <a
                    id="footer-social-youtube"
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-slate-800 p-2.5 text-slate-300 transition-all hover:bg-red-600 hover:text-white active:scale-95 cursor-pointer"
                  >
                    <FaYoutube size={16} />
                  </a>
                </>
              )}
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
