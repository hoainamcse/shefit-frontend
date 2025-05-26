import { z } from "zod";

export const formSchema = z.object({
  section_1: z.object({
    title: z.string(),
    features: z.array(z.string()),
    description: z.string(),
    image: z.string(),
    cta: z.object({
      text: z.string(),
      href: z.string(),
    }),
  }),
  section_2: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    features: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
    image: z.string(),
    cta: z.object({
      text: z.string(),
      href: z.string(),
    }),
  }),
  section_3: z.object({
    title: z.string(),
    description: z.string(),
    membership_ids: z.array(z.string()),
  }),
  section_4: z.object({
    title: z.string(),
    description: z.string(),
    cta: z.object({
      text: z.string(),
      href: z.string(),
    }),
  }),
  section_5: z.object({
    title: z.string(),
    description: z.string(),
    form_category: z.object({
      pear: z.object({
        description: z.string(),
        course_ids: z.array(z.string()),
      }),
      apple: z.object({
        description: z.string(),
        course_ids: z.array(z.string()),
      }),
      rectangle: z.object({
        description: z.string(),
        course_ids: z.array(z.string()),
      }),
      hourglass: z.object({
        description: z.string(),
        course_ids: z.array(z.string()),
      }),
      inverted_triangle: z.object({
        description: z.string(),
        course_ids: z.array(z.string()),
      }),
    }),
  }),
  section_7: z.object({
    title: z.string(),
    subtitle: z.string(),
    diet_ids: z.array(z.string()),
  }),
  section_8: z.object({
    title: z.string(),
    description: z.string(),
    product_ids: z.array(z.string()),
  }),
  section_9: z.object({
    coacher_ids: z.array(z.string()),
  }),
  section_10: z.object({
    top: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
    }),
    bottom: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
    }),
  }),
  section_11: z.object({
    image: z.string(),
  }),
});
