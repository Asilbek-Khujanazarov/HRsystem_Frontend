export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string | null; // Endi `null` va `undefined` qo‘llab-quvvatlanadi
  description: string;
}