import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Kalinga Computer Education. Send us a message for course details, admission enquiries, and timing information.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us | Kalinga Computer Education",
    "description": "Get in touch with Kalinga Computer Education. Send us a message for queries, course details, or admissions.",
    "url": "https://kalingacomputer.com/contact",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "Kalinga Computer Education",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Athagarh, Cuttack",
        "addressLocality": "Athagarh",
        "addressRegion": "Odisha",
        "postalCode": "754029",
        "addressCountry": "IN"
      },
      "telephone": "+91-9876543210"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactClient />
    </>
  );
}
