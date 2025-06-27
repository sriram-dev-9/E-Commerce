export type Review = {
  id: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'pickles' | 'spices' | 'essentials';
  reviews: Review[];
  dataAiHint: string;
};

const products: Product[] = [
  {
    id: 'mango-pickle',
    name: 'Spicy Mango Pickle',
    description: 'A classic Indian pickle made with raw mangoes, aromatic spices, and mustard oil. A tangy and spicy delight that complements any meal.',
    price: 249,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'mango pickle',
    category: 'pickles',
    reviews: [
      { id: 1, author: 'Priya S.', rating: 5, title: 'Just like homemade!', comment: 'This tastes exactly like the pickle my grandmother used to make. Perfectly spicy and tangy.', date: '2023-08-15' },
      { id: 2, author: 'Rajesh K.', rating: 4, title: 'Very flavorful', comment: 'A bit too spicy for my wife, but I love it. Great with parathas.', date: '2023-08-10' },
    ],
  },
  {
    id: 'lime-pickle',
    name: 'Tangy Lime Pickle',
    description: 'A zesty and pungent pickle made from lemons, mixed with a blend of traditional spices. Adds a burst of flavor to your dishes.',
    price: 229,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'lime pickle',
    category: 'pickles',
    reviews: [
        { id: 1, author: 'Anjali M.', rating: 5, title: 'So delicious!', comment: 'The perfect balance of sour and spice. My family finishes a jar in a week!', date: '2023-09-01' },
    ],
  },
  {
    id: 'garam-masala',
    name: 'Artisanal Garam Masala',
    description: 'A premium blend of hand-roasted spices, ground in small batches to preserve aroma and flavor. The heart of many Indian dishes.',
    price: 349,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'garam masala',
    category: 'spices',
    reviews: [
        { id: 1, author: 'Vikram C.', rating: 5, title: 'Incredibly aromatic', comment: 'You can tell this is high quality. It has elevated my cooking completely.', date: '2023-09-05' },
        { id: 2, author: 'Sunita P.', rating: 5, title: 'The best I have ever used', comment: 'This garam masala is so much better than the store-bought ones. Rich and complex flavor.', date: '2023-08-20' },
    ],
  },
  {
    id: 'turmeric-powder',
    name: 'Organic Turmeric Powder',
    description: 'Sourced from organic farms, this vibrant turmeric powder is known for its earthy flavor and brilliant color. A staple in every Indian kitchen.',
    price: 199,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'turmeric powder',
    category: 'spices',
    reviews: [],
  },
  {
    id: 'basmati-rice',
    name: 'Aged Basmati Rice',
    description: 'Premium, long-grain basmati rice, aged for two years to enhance its fragrant aroma and fluffy texture. Perfect for biryanis and pulao.',
    price: 499,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'basmati rice',
    category: 'essentials',
    reviews: [
        { id: 1, author: 'Amit G.', rating: 5, title: 'Restaurant quality rice', comment: 'This is the best basmati rice I have found outside of India. So fragrant!', date: '2023-07-12' },
    ],
  },
  {
    id: 'ghee',
    name: 'Pure Desi Ghee',
    description: 'Made from pure cow\'s milk using traditional methods, our ghee has a rich, nutty aroma and is perfect for cooking and religious ceremonies.',
    price: 599,
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'ghee cooking',
    category: 'essentials',
    reviews: [
        { id: 1, author: 'Meera N.', rating: 5, title: 'The real deal', comment: 'This ghee is so pure and tastes amazing. It reminds me of my village.', date: '2023-08-28' },
    ],
  },
];

export function getProducts(category?: string): Product[] {
  if (category) {
    return products.filter((p) => p.category === category);
  }
  return products;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
