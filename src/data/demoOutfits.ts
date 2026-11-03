/**
 * Curated High-Resolution Fashion Catalogue for TRY IT OUT
 * High quality fashion photography categorized by styles
 */
import { Outfit, Category, UserProfile } from '../types';

export const CATEGORIES: Category[] = [
  'All',
  'Casual',
  'Formal',
  'Traditional',
  'Streetwear',
  'Party Wear'
];

export const DEMO_OUTFITS: Outfit[] = [
  {
    id: 'outfit-01',
    name: 'Minimalist Sand Linen Suit',
    category: 'Casual',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
    price: '$220',
    description: 'Relaxed tailored two-piece made from breathable organic European flax. Perfect for effortless summer warmth and casual sophistication.',
    fabric: '100% Organic Linen',
    fit: 'Relaxed Tailored',
    season: 'Spring / Summer',
    tags: ['Eco-friendly', 'Linen', 'Breathable', 'Neutral']
  },
  {
    id: 'outfit-02',
    name: 'Midnight Double-Breasted Blazer',
    category: 'Formal',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
    price: '$380',
    description: 'Sharp peak-lapel silhouette crafted with super 120s virgin wool. Features mother-of-pearl buttons and hand-finished pick stitching.',
    fabric: 'Super 120s Italian Wool',
    fit: 'Slim Modern',
    season: 'All Seasons',
    tags: ['Luxury', 'Executive', 'Double-Breasted', 'Sharp']
  },
  {
    id: 'outfit-03',
    name: 'Royal Heritage Embroidered Sherwani',
    category: 'Traditional',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
    price: '$450',
    description: 'Bespoke raw silk bandhgala adorned with intricate zardozi and thread embroidery, finished with handcrafted antique brass buttons.',
    fabric: 'Raw Matka Silk',
    fit: 'Structured Regal',
    season: 'Festive / Wedding',
    tags: ['Handcrafted', 'Zardozi', 'Regal', 'Festive']
  },
  {
    id: 'outfit-04',
    name: 'Tokyo Oversized Utility Trench',
    category: 'Streetwear',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    price: '$290',
    description: 'Architectural streetwear outerwear featuring weather-resistant Japanese nylon, modular storm flaps, and dropped shoulder drop.',
    fabric: 'High-Density Japanese Gabardine',
    fit: 'Oversized Contemporary',
    season: 'Autumn / Winter',
    tags: ['Streetwear', 'Tokyo', 'Techwear', 'Modular']
  },
  {
    id: 'outfit-05',
    name: 'Emerald Silk Slip & Velvet Shrug',
    category: 'Party Wear',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
    price: '$340',
    description: 'Lustrous bias-cut mulberry silk with a delicate cowl neckline, paired with a rich cropped velvet statement blazer.',
    fabric: 'Pure Mulberry Silk & Cotton Velvet',
    fit: 'Fluid Draped',
    season: 'Cocktail / Evening',
    tags: ['Glamour', 'Velvet', 'Silk', 'Cocktail']
  },
  {
    id: 'outfit-06',
    name: 'Structured Ivory Power Suit',
    category: 'Formal',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
    price: '$360',
    description: 'Tailored clean-cut monochrome suit with padded architectural shoulders and high-rise pleated wide-leg trousers.',
    fabric: 'Crepe Virgin Wool',
    fit: 'Architectural Slim',
    season: 'All Seasons',
    tags: ['Power Dressing', 'Monochrome', 'Contemporary']
  },
  {
    id: 'outfit-07',
    name: 'Relaxed Cashmere Knit & Pleated Chino',
    category: 'Casual',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
    price: '$195',
    description: 'Ultra-soft 2-ply Mongolian cashmere crewneck styled effortlessly with tailored washed-cotton relaxed pleat trousers.',
    fabric: '100% Mongolian Cashmere & Chino Twill',
    fit: 'Classic Relaxed',
    season: 'Autumn / Spring',
    tags: ['Comfort', 'Cashmere', 'Timeless']
  },
  {
    id: 'outfit-08',
    name: 'Handwoven Banarasi Brocade Saree',
    category: 'Traditional',
    gender: 'Women',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    price: '$490',
    description: 'Exquisite heritage weave featuring delicate gold and silver zari floral jaal with a contrasting opulent pallu.',
    fabric: 'Katan Pure Silk with Silver Zari',
    fit: 'Graceful Draped',
    season: 'Festive / Wedding',
    tags: ['Heritage', 'Banarasi', 'Pure Silk', 'Artisan']
  },
  {
    id: 'outfit-09',
    name: 'Monochrome Acid-Wash Leather Jacket',
    category: 'Streetwear',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80',
    price: '$420',
    description: 'Heavyweight distressed lambskin leather jacket with asymmetrical silver hardware and custom interior silk lining.',
    fabric: '100% Lambskin Leather',
    fit: 'Boxy Cropped',
    season: 'Fall / Winter',
    tags: ['Leather', 'Distressed', 'Biker', 'Statement']
  },
  {
    id: 'outfit-10',
    name: 'Midnight Velvet Tuxedo with Satin Shawl',
    category: 'Party Wear',
    gender: 'Men',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
    price: '$520',
    description: 'Opulent deep midnight blue plush velvet jacket with contrasting black silk satin shawl collar and tailored trousers.',
    fabric: 'Italian Cotton Velvet & Silk Satin',
    fit: 'Tailored Black Tie',
    season: 'Gala / Evening',
    tags: ['Black Tie', 'Velvet', 'Luxury', 'Gala']
  },
  {
    id: 'outfit-11',
    name: 'Terracotta Resort Shirt & Drawstring Trouser',
    category: 'Casual',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    price: '$165',
    description: 'Cuban collar relaxed shirt in earth-toned lyocell drape paired with tapered elasticized drawstring linen pants.',
    fabric: 'TENCEL™ Lyocell & Linen Blend',
    fit: 'Breezy Relaxed',
    season: 'Summer / Resort',
    tags: ['Resort', 'Earth Tones', 'Lightweight']
  },
  {
    id: 'outfit-12',
    name: 'Contemporary Chikankari Kurta Ensemble',
    category: 'Traditional',
    gender: 'Unisex',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
    price: '$275',
    description: 'Delicate tone-on-tone Lucknowi chikankari embroidery on pure mulmul cotton, paired with straight churidar trousers.',
    fabric: '100% Fine Mulmul Cotton',
    fit: 'Flowing Elegant',
    season: 'All Seasons',
    tags: ['Chikankari', 'Craftsmanship', 'Subtle Luxury']
  }
];

export const DEMO_USER: UserProfile = {
  id: 'usr_premium_01',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@lifestyle.studio',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  memberSince: 'March 2026',
  tier: 'Try It Out Pro Member',
  preferences: {
    preferredCategory: 'All',
    genderPreference: 'All Styles',
    notifications: true,
    highQualityRender: true
  },
  stats: {
    tryOnsCompleted: 14,
    savedLooks: 5
  }
};
