'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import type { ProjectDisplay } from '@/lib/projects-data';

type Props = { projects: ProjectDisplay[] };

export default function ProjectsFilter({ projects }: Props) {
  const t = useTranslations();
  const [filter, setFilter] = useState('all');

  const filters = [
    { key: 'all', label: t('projects.filterAll') },
    { key: 'retail', label: t('projects.filterRetail') },
    { key: 'fnb', label: t('projects.filterFnb') },
    { key: 'commercial', label: t('projects.filterCommercial') },
    { key: 'industrial', label: t('projects.filterIndustrial') },
  ];

  const filtered = filter === 'all' ? projects : projects.filter(p => p.cat === filter);

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-12 flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-6 py-2.5 text-[11px] font-bold uppercase tracking-[2px] transition-all
              ${filter === f.key
                ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/8 text-white'
                : 'border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:border-[var(--color-brand)] hover:text-white'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="project-card group relative block aspect-[4/5] cursor-pointer overflow-hidden rounded transition-all duration-500">
            <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/10 to-transparent opacity-0 transition-opacity duration-600 group-hover:opacity-100" />
            <div className="absolute inset-x-0 bottom-0 translate-y-6 p-6 opacity-0 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 lg:p-8">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[var(--color-brand)]">{p.tag}</span>
              <h3 className="mt-2 text-lg font-bold text-white lg:text-xl">{p.title}</h3>
              <p className="mt-1.5 text-[13px] text-[var(--color-text-secondary)]">{p.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
