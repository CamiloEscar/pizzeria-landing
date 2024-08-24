// interfaces/PizzaCardProps.ts
import { Pizza } from '../interfaces/pizza';

export interface PizzaCardProps {
  pizza: Pizza;
  addToCart: (pizza: Pizza) => void;  // Asegúrate de que el nombre sea `addToCart` en lugar de `onAddToCart`
}
