import CoursesClient from "./CoursesClient";

export const metadata = {
  title: "Computer & Technical Courses",
  description: "Explore our wide range of computer courses including DCA, PGDCA, Python, Java, Tally, Web Development, and AI. Enroll today for expert training and certificates.",
  alternates: {
    canonical: "/courses",
  },
};

export default function CoursesPage() {
  return <CoursesClient />;
}
