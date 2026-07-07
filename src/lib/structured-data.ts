import { SITE_NAME, SITE_URL } from '@/lib/seo';

// JSON-LD builders. Rendered via <JsonLd data={...} /> in server components.

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: '+96597234117',
    email: 'info@igateinteriors.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Fahaheel',
      addressCountry: 'KW',
    },
    areaServed: { '@type': 'Country', name: 'Kuwait' },
    // Open 24/7: all seven days, 00:00–23:59 (schema.org's pattern for
    // round-the-clock operation).
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  };
}

export function servicesJsonLd(services: Array<{ title: string; desc: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.desc,
        provider: { '@type': 'GeneralContractor', name: SITE_NAME, url: SITE_URL },
        areaServed: { '@type': 'Country', name: 'Kuwait' },
      },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
