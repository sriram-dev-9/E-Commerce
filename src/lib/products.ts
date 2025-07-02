export type Review = {
  id: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

export type ProductVariant = {
  qty: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'pickles' | 'spices' | 'essentials';
  subcategory: 'veg' | 'nonveg' | 'podulu';
  variants: ProductVariant[];
  reviews: Review[];
  dataAiHint: string;
};

const products: Product[] = [
  // Vegetarian Pickles
  {
    id: 'avakaya',
    name: 'Avakaya (Konaseema Mango Pickle)',
    description: 'Traditional mango pickle from Konaseema, Andhra Pradesh.',
    image: 'https://placehold.co/600x600.png',
    dataAiHint: 'mango pickle',
    category: 'pickles',
    subcategory: 'veg',
    variants: [
      { qty: '250g', price: 150 },
      { qty: '500g', price: 300 },
      { qty: '1kg', price: 600 },
    ],
    reviews: [],
  },
  { id: 'maagaya', name: 'Maagaya Pickle (Dry Mango)', description: 'Dry mango pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'dry mango pickle', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'tomato', name: 'Tomato Pickle', description: 'Spicy and tangy tomato pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'tomato pickle', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'lemon', name: 'Lemon Pickle', description: 'Zesty lemon pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'lemon pickle', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'gongura', name: 'Gongura Pickle', description: 'Andhra-style gongura pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'gongura pickle', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'thokku', name: 'Thokku Pachadi (Mango Pickle)', description: 'Mango thokku pachadi.', image: 'https://placehold.co/600x600.png', dataAiHint: 'mango thokku', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'mixed-veg', name: 'Mixed Vegetable Pickle', description: 'Mixed vegetable pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'mixed vegetable pickle', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'cauliflower', name: 'Cauliflower Pickle', description: 'Cauliflower pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'cauliflower pickle', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'drumstick', name: 'Drumstick Pickle', description: 'Drumstick pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'drumstick pickle', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'amla', name: 'Amla Pickle (Usirikaya Pickle)', description: 'Amla (gooseberry) pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'amla pickle', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'panasapottu', name: 'Panasapottu Avakaya', description: 'Jackfruit seed mango pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'panasapottu avakaya', category: 'pickles', subcategory: 'veg', variants: [{ qty: '250g', price: 150 }], reviews: [] },

  // Non-Veg Pickles
  { id: 'chicken-aavakaya-bone', name: 'Chicken aavakaya (bone)', description: 'Chicken aavakaya pickle with bone.', image: 'https://placehold.co/600x600.png', dataAiHint: 'chicken aavakaya bone', category: 'pickles', subcategory: 'nonveg', variants: [{ qty: '500g', price: 600 }, { qty: '1kg', price: 1200 }], reviews: [] },
  { id: 'chicken-aavakaya-boneless', name: 'Chicken aavakaya (bone less)', description: 'Boneless chicken aavakaya pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'chicken aavakaya boneless', category: 'pickles', subcategory: 'nonveg', variants: [{ qty: '500g', price: 700 }, { qty: '1kg', price: 1400 }], reviews: [] },
  { id: 'gongura-chicken-boneless', name: 'Gongura chicken (boneless)', description: 'Boneless gongura chicken pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'gongura chicken boneless', category: 'pickles', subcategory: 'nonveg', variants: [{ qty: '500g', price: 700 }, { qty: '1kg', price: 1400 }], reviews: [] },
  { id: 'prawn', name: 'Prawn', description: 'Prawn pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'prawn pickle', category: 'pickles', subcategory: 'nonveg', variants: [{ qty: '500g', price: 900 }, { qty: '1kg', price: 1800 }], reviews: [] },
  { id: 'gongura-prawn', name: 'Gongura Prawn', description: 'Gongura prawn pickle.', image: 'https://placehold.co/600x600.png', dataAiHint: 'gongura prawn', category: 'pickles', subcategory: 'nonveg', variants: [{ qty: '500g', price: 900 }, { qty: '1kg', price: 1800 }], reviews: [] },

  // Podulu (Spices/Powders)
  { id: 'idly-karam', name: 'Idly Karam podi', description: 'Spicy idly karam podi.', image: 'https://placehold.co/600x600.png', dataAiHint: 'idly karam podi', category: 'spices', subcategory: 'podulu', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'dhaniyala', name: 'Dhaniyala podi', description: 'Coriander (dhaniya) podi.', image: 'https://placehold.co/600x600.png', dataAiHint: 'dhaniyala podi', category: 'spices', subcategory: 'podulu', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'kandhi', name: 'Kandhi Podi', description: 'Protein-rich kandhi podi.', image: 'https://placehold.co/600x600.png', dataAiHint: 'kandhi podi', category: 'spices', subcategory: 'podulu', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'velluli-karam', name: 'Velluli karam podi', description: 'Garlic (velluli) karam podi.', image: 'https://placehold.co/600x600.png', dataAiHint: 'velluli karam podi', category: 'spices', subcategory: 'podulu', variants: [{ qty: '250g', price: 150 }], reviews: [] },
  { id: 'karivepaku', name: 'Karivepaku podi', description: 'Curry leaf (karivepaku) podi.', image: 'https://placehold.co/600x600.png', dataAiHint: 'karivepaku podi', category: 'spices', subcategory: 'podulu', variants: [{ qty: '250g', price: 150 }], reviews: [] },
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
