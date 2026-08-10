export default function robots() {
  const baseUrl = "https://kalingacomputer.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/courses",
          "/contact",
          "/learning/notes",
          "/learning/exam-information",
        ],
        disallow: ["/admin", "/admin/*", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
