import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Retail', value: 'retail' },
          { title: 'F&B', value: 'fnb' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Industrial', value: 'industrial' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'area',
      title: 'Area (e.g. 8,000 SQM)',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (e.g. 3 months)',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year Completed',
      type: 'number',
      validation: (r) => r.integer().min(2000).max(2100),
    }),
    defineField({
      name: 'scopes',
      title: 'Scopes of Work',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Fit-Out', value: 'Fit-Out' },
          { title: 'Joinery', value: 'Joinery' },
          { title: 'MEP', value: 'MEP' },
          { title: 'Hoarding', value: 'Hoarding' },
          { title: 'Demolition', value: 'Demolition' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'images.0' },
  },
});
