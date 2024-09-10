import { Pizza } from "./pizza";
import { Combo } from "./Combo";

const api = {
    pizza: {
        list: async (): Promise<Pizza[]> => {
            return fetch(
                "https://docs.google.com/spreadsheets/d/1sAWtNHo2vGtWAZK_bMdCZfkI-oWqGyJ0QY_zms5ZNik/pub?gid=0&single=true&output=tsv",
                { next: { tags: ["pizzas"] } }
            )
            .then((res) => res.text())
            .then((text) => {
                return text
                    .split("\n")
                    .slice(1)
                    .map((row) => {
                        const [id, name, description, price, image, rating, promotion, receta] = row.split("\t");

                        return {
                            id: parseInt(id.trim()),          // Convertir id a número
                            name: name.trim(),
                            description: description.trim(),
                            price: parseFloat(price.trim()),  // Convertir price a número
                            image: image.trim(),
                            rating: parseFloat(rating.trim()), // Convertir rating a número
                            promotion: promotion ? promotion.trim() : undefined,
                            receta: receta ? receta.trim().split(",").map(item => item.trim()) : [] // Convertir receta a array
                        } as Pizza;  // Asegurarse de que el tipo devuelto sea Pizza
                    });
            });
        },
        combos: async (): Promise<Combo[]> => {
            // Obtén la lista de pizzas completa para calcular originalPrice
            const pizzas = await api.pizza.list();

            return fetch(
                "https://docs.google.com/spreadsheets/d/1sAWtNHo2vGtWAZK_bMdCZfkI-oWqGyJ0QY_zms5ZNik/pub?gid=1122033337&single=true&output=tsv", // URL actualizada para la hoja Combos
                { next: { tags: ["combos"] } }
            )
            .then((res) => res.text())
            .then((text) => {
                const combos: Combo[] = [];
                text.split("\n")
                    .slice(1)
                    .forEach((row) => {
                        const [comboName, pizzaIdsString, specialPriceString] = row.split("\t");

                        if (!comboName || !pizzaIdsString || !specialPriceString) {
                            // Ignorar filas incompletas
                            return;
                        }

                        const pizzaIds = pizzaIdsString.split(",")
                            .map(id => parseInt(id.trim()))
                            .filter(id => !isNaN(id)); // Filtrar IDs no válidos

                        // Validar specialPrice y convertirlo a número
                        const specialPrice = parseFloat(specialPriceString.trim().replace(".", "").replace(",", "."));
                        if (isNaN(specialPrice) || specialPrice <= 0) {
                            return;
                        }

                        // Calcula el originalPrice sumando los precios de las pizzas
                        const originalPrice = pizzaIds.reduce((total, id) => {
                            const pizza = pizzas.find(p => p.id === id);
                            return pizza ? total + pizza.price : total;
                        }, 0);

                        // Empuja el combo al array con todas las propiedades requeridas
                        combos.push({
                            comboName: comboName.trim(),
                            pizzaIds,
                            specialPrice,
                            originalPrice
                        });
                    });
                return combos;
            });
        }
    }
};

export default api;
