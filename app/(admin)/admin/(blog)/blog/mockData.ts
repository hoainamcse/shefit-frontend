export interface Blog {
  id: string
  title: string
  image: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "The Benefits of Regular Exercise",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Regular exercise has numerous benefits for both physical and mental health. It helps improve cardiovascular health, strengthens muscles and bones, and boosts mood through the release of endorphins...",
    createdAt: new Date("2025-03-01"),
    updatedAt: new Date("2025-03-01")
  },
  {
    id: "2",
    title: "Nutrition Tips for a Healthy Lifestyle",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Eating a balanced diet is crucial for maintaining good health. Focus on incorporating a variety of whole foods, including fruits, vegetables, lean proteins, and healthy fats...",
    createdAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-03-05")
  },
  {
    id: "3",
    title: "Mindfulness and Mental Wellness",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Practicing mindfulness can significantly improve mental health and overall well-being. Simple techniques like deep breathing, meditation, and mindful movement can help reduce stress and anxiety...",
    createdAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-03-10")
  },
  {
    id: "4",
    title: "Sleep Hygiene: Tips for Better Rest",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Quality sleep is essential for physical and mental health. Establishing a consistent sleep schedule, creating a comfortable sleep environment, and avoiding stimulants before bedtime can improve sleep quality...",
    createdAt: new Date("2025-03-15"),
    updatedAt: new Date("2025-03-15")
  },
  {
    id: "5",
    title: "Stress Management Techniques",
    image: "https://i.pinimg.com/736x/5b/7e/a0/5b7ea08248cf75a375fea77826191052.jpg",
    content: "Effective stress management is crucial for maintaining overall health. Techniques such as regular exercise, proper nutrition, mindfulness practices, and social support can help reduce stress levels...",
    createdAt: new Date("2025-03-20"),
    updatedAt: new Date("2025-03-20")
  }
]
