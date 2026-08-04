import Image from "next/image";

import HeroSlider from "@/components/HeroSlider";
import TopStudents from "@/components/TopStudents";
import Statistics from "@/components/Statistics";
import AvailableCourses from "@/components/AvailableCourses";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

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
