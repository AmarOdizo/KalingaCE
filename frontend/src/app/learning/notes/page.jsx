import NotesClient from "./NotesClient";

export const metadata = {
  title: "Study Notes & IT Resources",
  description: "Access premium computer education notes, course resources, study guides, and reference material for DCA, PGDCA, programming, and database systems.",
  alternates: {
    canonical: "/learning/notes",
  },
};

export default function LearningNotesPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Study Notes & IT Resources | Kalinga Computer Education",
    "description": "Access premium computer education notes, course resources, study guides, and reference material.",
    "url": "https://kalingacomputer.com/learning/notes"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <NotesClient />
    </>
  );
}
