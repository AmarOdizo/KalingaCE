export default async function sitemap() {
  const baseUrl = "https://kalingacomputer.com";

  const routes = [
    "",
    "/courses",
    "/contact",
    "/learning/notes",
    "/learning/exam-information",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return routes;
}
