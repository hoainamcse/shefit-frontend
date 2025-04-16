export const memberships: {
  id: string;
  name: string;
  plans: { id: string; duration: number; price: number }[];
  gifts: { id: string; name: string; image: string }[];
}[] = [
  {
    id: "1",
    name: "Basic",
    plans: [
      { id: "1", duration: 1, price: 100000 },
      { id: "2", duration: 3, price: 290000 },
      { id: "3", duration: 6, price: 590000 },
    ],
    gifts: [
      { id: "1", name: "Mũ tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "2", name: "Túi tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "3", name: "Áo tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "4", name: "Giày tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
    ],
  },
  {
    id: "2",
    name: "Premium",
    plans: [
      { id: "1", duration: 3, price: 200000 },
      { id: "2", duration: 6, price: 590000 },
      { id: "3", duration: 9, price: 1190000 },
    ],
    gifts: [
      { id: "1", name: "Mũ tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "2", name: "Túi tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "3", name: "Áo tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "4", name: "Giày tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "5", name: "Dây tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
    ],
  },
  {
    id: "3",
    name: "VIP",
    plans: [
      { id: "1", duration: 6, price: 500000 },
      { id: "2", duration: 9, price: 1490000 },
      { id: "3", duration: 12, price: 2990000 },
    ],
    gifts: [
      { id: "1", name: "Mũ tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "2", name: "Túi tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "3", name: "Áo tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "4", name: "Giày tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "5", name: "Dây tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "6", name: "Tạ tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
      { id: "7", name: "Máy tập gym", image: "https://i.imgur.com/0o5Rq4V.png" },
    ],
  },
]
