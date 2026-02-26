import { Product, Order } from '../types';

export const CATEGORIES = ['All', 'Men', 'Women', 'Accessories', 'Summer Collection'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Summer Breeze Linen Shirt",
    slug: "summer-breeze-linen-shirt",
    price: 45.00,
    categoryName: "Men",
    category_id: 1,
    created_at: new Date().toISOString(),
    image: "https://picsum.photos/seed/shirt1/400/500",
    description: "Lightweight linen shirt perfect for hot summer days. Breathable fabric and relaxed fit.",
    rating: 4.5,
    reviews: 120,
    isNew: true,
    stock: 50
  },
  {
    id: 2,
    name: "Floral Sundress",
    slug: "floral-sundress",
    price: 65.50,
    categoryName: "Women",
    category_id: 2,
    created_at: new Date().toISOString(),
    image: "https://picsum.photos/seed/dress1/400/500",
    description: "Beautiful floral pattern sundress with adjustable straps. Ideal for beach parties.",
    rating: 4.8,
    reviews: 85,
    stock: 20
  },
  {
    id: 3,
    name: "Classic Aviator Sunglasses",
    slug: "classic-aviator-sunglasses",
    price: 25.00,
    categoryName: "Accessories",
    category_id: 3,
    created_at: new Date().toISOString(),
    image: "https://picsum.photos/seed/glasses1/400/500",
    description: "Timeless aviator style sunglasses with UV protection.",
    rating: 4.2,
    reviews: 45,
    stock: 100
  },
  {
    id: 4,
    name: "Urban Denim Jacket",
    slug: "urban-denim-jacket",
    price: 89.99,
    categoryName: "Men",
    category_id: 1,
    created_at: new Date().toISOString(),
    image: "https://picsum.photos/seed/jacket1/400/500",
    description: "Rugged denim jacket with a modern cut. Versatile for any season.",
    rating: 4.6,
    reviews: 210,
    stock: 15
  },
  {
    id: 5,
    name: "Boho Chic Maxi Skirt",
    slug: "boho-chic-maxi-skirt",
    price: 55.00,
    categoryName: "Women",
    category_id: 2,
    created_at: new Date().toISOString(),
    image: "https://picsum.photos/seed/skirt1/400/500",
    description: "Flowy maxi skirt with intricate patterns. Comfortable elastic waistband.",
    rating: 4.7,
    reviews: 92,
    isNew: true,
    stock: 35
  },
  {
    id: 6,
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    price: 18.00,
    categoryName: "Accessories",
    category_id: 3,
    created_at: new Date().toISOString(),
    image: "https://picsum.photos/seed/bag1/400/500",
    description: "Durable canvas tote, perfect for shopping or a day at the beach.",
    rating: 4.9,
    reviews: 300,
    stock: 200
  },
  {
    id: 7,
    name: "Sunset Orange Hoodie",
    slug: "sunset-orange-hoodie",
    price: 40.00,
    categoryName: "Summer Collection",
    category_id: 4,
    created_at: new Date().toISOString(),
    image: "https://picsum.photos/seed/hoodie1/400/500",
    description: "Vibrant orange hoodie to keep you warm during cool summer nights.",
    rating: 4.4,
    reviews: 55,
    stock: 40
  },
  {
    id: 8,
    name: "Leather Sandals",
    slug: "leather-sandals",
    price: 35.00,
    categoryName: "Accessories",
    category_id: 3,
    created_at: new Date().toISOString(),
    image: "https://picsum.photos/seed/shoes1/400/500",
    description: "Handcrafted leather sandals. Stylish and durable.",
    rating: 4.3,
    reviews: 78,
    stock: 60
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 7782,
    userId: "u1",
    date: "2023-10-25",
    total: 120.50,
    total_amount: 120.50,
    status: "delivered",
    items: [],
    payment_method: "credit_card",
    shipping_address_id: null,
    tracking_number: null,
    notes: null,
    coupon_code: null,
    discount_amount: 0
  },
  {
    id: 9921,
    userId: "u2",
    date: "2023-10-26",
    total: 45.00,
    total_amount: 45.00,
    status: "processing",
    items: [],
    payment_method: "credit_card",
    shipping_address_id: null,
    tracking_number: null,
    notes: null,
    coupon_code: null,
    discount_amount: 0
  },
  {
    id: 1102,
    userId: "u3",
    date: "2023-10-27",
    total: 210.00,
    total_amount: 210.00,
    status: "pending",
    items: [],
    payment_method: "credit_card",
    shipping_address_id: null,
    tracking_number: null,
    notes: null,
    coupon_code: null,
    discount_amount: 0
  }
];