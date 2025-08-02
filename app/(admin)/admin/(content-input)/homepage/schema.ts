import { z } from 'zod'

export const formSchema = z.object({
  section_1: z.object({
    title: z.string(),
    features: z.array(z.string()),
    description: z.string(),
    image_desktop: z.string(),
    image_mobile: z.string(),
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
    image_desktop: z.string(),
    image_mobile: z.string(),
    cta: z.object({
      text: z.string(),
      href: z.string(),
    }),
  }),
  section_3: z.object({
    title: z.string(),
    description: z.string(),
    subscription_ids: z.array(z.number()),
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
    video: z.object({
      description: z.string(),
      course_ids: z.array(z.number()),
    }),
    zoom: z.object({
      description: z.string(),
      course_ids: z.array(z.number()),
    }),
  }),
  section_6: z.object({
    title: z.string(),
    features: z.array(
      z.object({
        workout_method_id: z.number(),
        description: z.string(),
        course_ids: z.array(z.number()),
      })
    ),
  }),
  section_7: z.object({
    title: z.string(),
    subtitle: z.string(),
    meal_plan_ids: z.array(z.number()),
  }),
  section_8: z.object({
    title: z.string(),
    description: z.string(),
    product_ids: z.array(z.number()),
  }),
  section_9: z.object({
    coach_ids: z.array(z.number()),
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
    description: z.string(),
    cta: z.object({
      text: z.string(),
      href: z.string(),
    }),
  }),
})
