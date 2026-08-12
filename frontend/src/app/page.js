import Image from "next/image";

import HeroSlider from "@/components/HeroSlider";
import TopStudents from "@/components/TopStudents";
import Statistics from "@/components/Statistics";
import AvailableCourses from "@/components/AvailableCourses";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Kalinga Computer Education | Premium Computer & Technical Training",
  description: "Empower your career with specialized IT, computing, and professional courses at Kalinga Computer Education. Hands-on training, industry certifications, and top placement rates.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <HeroSlider />
      <TopStudents />
      <Statistics />
      <AvailableCourses />
      {/* Other Sections */}
      <FAQ />
      {/* Your Sections */}

      <Footer />
    </>
  );
}
