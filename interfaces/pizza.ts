export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  halfPrice : number;
  image: string;
  rating: number;
  promotion?: string; 
  receta?: string[];
}