import CoursesClient from "./CoursesClient";
import { getCourses } from "@/components/courseData";

export const metadata = {
  title: "Computer & Technical Courses",
  description: "Explore our wide range of computer courses including DCA, PGDCA, Python, Java, Tally, Web Development, and AI. Enroll today for expert training and certificates.",
  alternates: {
    canonical: "/courses",
  },
};

export default async function CoursesPage() {
  let coursesList = [];
  try {
    coursesList = await getCourses();
  } catch (err) {
    console.error("Failed to load courses on server for SEO JSON-LD:", err);
  }

  // Generate Course Schema (ItemList)
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Computer & Technical Courses | Kalinga Computer Education",
    "description": "Explore our wide range of computer courses including DCA, PGDCA, Python, Java, Tally, Web Development, and AI.",
    "url": "https://kalingacomputer.com/courses",
    "itemListElement": (coursesList || []).map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.courseName || "Computer Course",
        "description": course.shortDescription || "Computer education course",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "Kalinga Computer Education",
          "sameAs": "https://kalingacomputer.com"
        }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <CoursesClient />
    </>
  );
}
