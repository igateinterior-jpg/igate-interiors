// Server component: renders JSON-LD structured data into the page HTML.
// '<' is escaped so document text in CMS content can never close the script
// tag and inject markup.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
