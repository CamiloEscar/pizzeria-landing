export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number; //opcional
  promotion?: string; //opcional
}