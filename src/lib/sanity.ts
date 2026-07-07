import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';

// ─── CONFIG ───

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
};

// createClient throws when projectId is empty, so only instantiate once the
// env vars are set. Every helper below guards on this and falls back.
export const client = sanityConfig.projectId ? createClient(sanityConfig) : null;

// ─── IMAGE HELPER ───

export function urlFor(source: SanityImageSource) {
  if (!client) {
    throw new Error('Sanity is not configured — set NEXT_PUBLIC_SANITY_PROJECT_ID');
  }
  return imageUrlBuilder(client).image(source);
}

// ─── TYPES ───

export interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  description?: string;
  images?: SanityImageSource[];
  client?: string;
  location?: string;
  area?: string;
  duration?: string;
  year?: number;
  scopes?: string[];
  featured?: boolean;
}

export interface SanityService {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  features?: string[];
  image?: SanityImageSource;
  order?: number;
}

export interface SanityTestimonial {
  _id: string;
  text: string;
  authorName: string;
  authorRole?: string;
  rating?: number;
}

// ─── GROQ QUERIES ───
// Each helper returns [] (or null) when Sanity is unconfigured or unreachable,
// so pages can fall back to their hardcoded data.

const REVALIDATE_SECONDS = 60;
const fetchOptions = { next: { revalidate: REVALIDATE_SECONDS } };

// images[defined(asset)] drops array entries without an uploaded asset
// (possible via API writes or an editor publishing mid-upload) — urlFor
// throws on those.
const PROJECT_FIELDS = `
  _id, title, slug, category, description,
  "images": images[defined(asset)],
  client, location, area, duration, year, scopes, featured
`;

export async function getProjects(): Promise<SanityProject[]> {
  if (!client) return [];
  try {
    return await client.fetch(
      `*[_type == "project" && defined(slug.current)] | order(_createdAt desc) { ${PROJECT_FIELDS} }`,
      {},
      fetchOptions
    );
  } catch {
    return [];
  }
}

// Unlike the list helpers, this one lets fetch errors propagate: the detail
// page turns null into notFound(), and under ISR a 404 render REPLACES the
// cached page. A transient Sanity outage must throw instead, so Next.js
// keeps serving the last good page.
export async function getProjectBySlug(slug: string): Promise<SanityProject | null> {
  if (!client) return null;
  const project = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_FIELDS} }`,
    { slug },
    fetchOptions
  );
  return project ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  if (!client) return [];
  try {
    const slugs = await client.fetch<Array<string | null>>(
      `*[_type == "project" && defined(slug.current)].slug.current`,
      {},
      fetchOptions
    );
    return slugs.filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

export async function getServices(): Promise<SanityService[]> {
  if (!client) return [];
  try {
    return await client.fetch(
      `*[_type == "service"] | order(order asc) {
        _id, title, slug, description, features, order,
        "image": select(defined(image.asset) => image)
      }`,
      {},
      fetchOptions
    );
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<SanityTestimonial[]> {
  if (!client) return [];
  try {
    return await client.fetch(
      `*[_type == "testimonial"] | order(_createdAt desc) {
        _id, text, authorName, authorRole, rating
      }`,
      {},
      fetchOptions
    );
  } catch {
    return [];
  }
}
