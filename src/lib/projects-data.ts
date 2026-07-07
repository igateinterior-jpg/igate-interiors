import { urlFor, type SanityProject } from '@/lib/sanity';

// Plain serializable shape shared by the projects index (incl. its client
// filter child) and the /projects/[slug] detail page. Sanity documents are
// mapped into it on the server; the hardcoded array below fills the same
// shape when Sanity has no content.

export interface ProjectDisplay {
  slug: string;
  title: string;
  tag: string;
  desc: string;
  cat: string;
  img: string;
  images: string[];
  client?: string;
  location?: string;
  area?: string;
  duration?: string;
  year?: number;
  scopes?: string[];
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<string, string> = {
  retail: 'Retail',
  fnb: 'F&B',
  commercial: 'Commercial',
  industrial: 'Industrial',
};

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format';

export function mapSanityProject(p: SanityProject): ProjectDisplay {
  const label = CATEGORY_LABELS[p.category] ?? p.category;
  const images = (p.images ?? []).map((img) =>
    urlFor(img).width(1600).auto('format').url()
  );
  return {
    slug: p.slug.current,
    title: p.title,
    tag: p.location ? `${label} — ${p.location}` : label,
    desc: p.description ?? '',
    cat: p.category,
    img: images[0] ?? PLACEHOLDER_IMG,
    images,
    client: p.client,
    location: p.location,
    area: p.area,
    duration: p.duration,
    year: p.year,
    scopes: p.scopes,
    featured: p.featured,
  };
}

export const fallbackProjects: ProjectDisplay[] = [
  { slug: 'tim-hortons', title: 'Tim Hortons', tag: 'F&B — Mall 360', desc: 'Full restaurant fit-out: kitchen, seating, brand signage, and MEP.', cat: 'fnb', location: 'Mall 360', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format'] },
  { slug: 'skechers-flagship', title: 'Skechers Flagship', tag: 'Retail — The Avenues', desc: 'Complete retail transformation with custom joinery and display systems.', cat: 'retail', location: 'The Avenues', img: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=1600&auto=format'] },
  { slug: 'executive-office-suite', title: 'Executive Office Suite', tag: 'Corporate — Fahaheel', desc: 'Premium office with conference rooms and custom partitions.', cat: 'commercial', location: 'Fahaheel', img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format'] },
  { slug: 'levis-store', title: "Levi's Store", tag: 'Retail — Al Kout', desc: 'Heritage-inspired design with industrial finishes and bespoke fixtures.', cat: 'retail', location: 'Al Kout', img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format'] },
  { slug: 'brand-bazaar-warehouse', title: 'Brand Bazaar Warehouse', tag: 'Industrial — Shuwaikh', desc: '8,000 SQM warehouse with MEP, partitioning, and shelving.', cat: 'industrial', location: 'Shuwaikh', area: '8,000 SQM', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format'] },
  { slug: 'rb-fashion', title: 'R&B Fashion', tag: 'Retail — The Avenues', desc: 'Multi-level fashion retail space with dynamic lighting.', cat: 'retail', location: 'The Avenues', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1600&auto=format'] },
  { slug: 'rock-house-sliders', title: 'Rock House Sliders', tag: 'F&B — Al Kout', desc: 'Casual dining concept with industrial-chic interior and open kitchen.', cat: 'fnb', location: 'Al Kout', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format'] },
  { slug: 'athletes-co', title: "Athlete's Co.", tag: 'Retail — 360 Mall', desc: 'Sports retail concept with dynamic display zones and fitting areas.', cat: 'retail', location: '360 Mall', img: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1600&auto=format'] },
  { slug: 'corporate-headquarters', title: 'Corporate Headquarters', tag: 'Corporate — Kuwait City', desc: 'Full-floor office renovation with custom millwork and AV systems.', cat: 'commercial', location: 'Kuwait City', img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format', images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format'] },
];
