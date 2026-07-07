import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author Role / Company',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
      validation: (r) => r.min(1).max(5).integer(),
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'authorRole' },
  },
});
