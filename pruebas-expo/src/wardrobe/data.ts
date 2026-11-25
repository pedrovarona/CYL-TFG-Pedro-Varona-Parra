import type { ImageSourcePropType } from 'react-native';

export const photos = {
  knit: require('../../assets/wardrobe/knit.jpg'), tee: require('../../assets/wardrobe/tee.jpg'),
  jeans: require('../../assets/wardrobe/jeans.jpg'), shoes: require('../../assets/wardrobe/shoes.jpg'),
  jacket: require('../../assets/wardrobe/jacket.jpg'), leather: require('../../assets/wardrobe/leather.jpg'),
  shirt: require('../../assets/wardrobe/shirt.jpg'), bag: require('../../assets/wardrobe/bag.jpg'),
  hero: require('../../assets/wardrobe/hero.jpg'), look: require('../../assets/wardrobe/look.jpg'),
  avatar: require('../../assets/wardrobe/avatar.jpg'), friend: require('../../assets/wardrobe/friend.jpg'),
};
export const categories = ['Todo', 'Tops', 'Pantalones', 'Abrigos', 'Calzado', 'Accesorios'] as const;
export type Category = typeof categories[number];
export type Garment = {
  id: string; name: string; brand: string; category: Category; color: string;
  season: string; image: ImageSourcePropType; favorite: boolean; shared: boolean;
  owner: string; wears: number;
};
export type Outfit = { id: string; name: string; occasion: string; items: string[]; favorite: boolean };
export const initialGarments: Garment[] = [
  { id: '1', name: 'Jersey de punto', brand: 'Mango', category: 'Tops', color: 'Crudo', season: 'Otoño / Invierno', image: photos.knit, favorite: true, shared: true, owner: 'Tú', wears: 12 },
  { id: '2', name: 'Denim de siempre', brand: 'Levi’s', category: 'Pantalones', color: 'Azul', season: 'Todo el año', image: photos.jeans, favorite: false, shared: false, owner: 'Tú', wears: 24 },
  { id: '3', name: 'Camiseta esencial', brand: 'Uniqlo', category: 'Tops', color: 'Blanco', season: 'Todo el año', image: photos.tee, favorite: false, shared: true, owner: 'Tú', wears: 18 },
  { id: '4', name: 'Sneakers de diario', brand: 'Nike', category: 'Calzado', color: 'Marrón', season: 'Todo el año', image: photos.shoes, favorite: true, shared: false, owner: 'Tú', wears: 32 },
  { id: '5', name: 'Chaqueta utility', brand: 'COS', category: 'Abrigos', color: 'Verde', season: 'Otoño / Invierno', image: photos.jacket, favorite: false, shared: true, owner: 'Tú', wears: 8 },
  { id: '6', name: 'Bolso de piel', brand: 'Massimo Dutti', category: 'Accesorios', color: 'Marrón', season: 'Todo el año', image: photos.bag, favorite: true, shared: true, owner: 'Tú', wears: 15 },
  { id: '7', name: 'Camisa relajada', brand: 'Zara', category: 'Tops', color: 'Blanco', season: 'Primavera / Verano', image: photos.shirt, favorite: false, shared: false, owner: 'Tú', wears: 6 },
  { id: '8', name: 'Biker de piel', brand: 'Mango', category: 'Abrigos', color: 'Negro', season: 'Otoño / Invierno', image: photos.leather, favorite: false, shared: true, owner: 'Tú', wears: 9 },
  { id: '9', name: 'La camisa de Lucía', brand: 'Sézane', category: 'Tops', color: 'Blanco', season: 'Primavera / Verano', image: photos.shirt, favorite: false, shared: true, owner: 'Lucía', wears: 4 },
  { id: '10', name: 'Chaqueta de finde', brand: 'Arket', category: 'Abrigos', color: 'Verde', season: 'Otoño / Invierno', image: photos.jacket, favorite: true, shared: true, owner: 'Marcos', wears: 7 },
  { id: '11', name: 'Un toque de cuero', brand: 'Polène', category: 'Accesorios', color: 'Marrón', season: 'Todo el año', image: photos.bag, favorite: false, shared: true, owner: 'Ana', wears: 3 },
  { id: '12', name: 'Punto para compartir', brand: 'COS', category: 'Tops', color: 'Crudo', season: 'Otoño / Invierno', image: photos.knit, favorite: false, shared: true, owner: 'Lucía', wears: 11 },
];
export const initialOutfits: Outfit[] = [
  { id: 'o1', name: 'Un café y sin prisa', occasion: 'Casual', items: ['1', '2', '4'], favorite: true },
  { id: 'o2', name: 'De la oficina al plan', occasion: 'Trabajo', items: ['7', '2', '6'], favorite: false },
  { id: 'o3', name: 'Viernes por la noche', occasion: 'Salir', items: ['8', '3', '4'], favorite: false },
];
export const friends = [
  { name: 'Lucía', handle: '@lucia.m', initials: 'LM', color: '#eedacf', image: photos.avatar, style: 'Básicos con un twist', count: 2 },
  { name: 'Marcos', handle: '@marcos.r', initials: 'MR', color: '#dbe4dd', image: photos.friend, style: 'Menos, pero mejor', count: 1 },
  { name: 'Ana', handle: '@ana.g', initials: 'AG', color: '#e8e0ee', image: undefined, style: 'Siempre un toque especial', count: 1 },
];
