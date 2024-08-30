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
                        const [id, name, description, price, image, rating, promotion] = row.split("\t");

                        return {
                            id: parseInt(id.trim()),          // Convertir id a número
                            name: name.trim(),
                            description: description.trim(),
                            price: parseFloat(price.trim()),  // Convertir price a número
                            image: image.trim(),
                            rating: parseFloat(rating.trim()), // Convertir rating a número
                            promotion: promotion ? promotion.trim() : undefined // Nueva propiedad opcional
                        } as Pizza;  // Asegurarse de que el tipo devuelto sea Pizza
                    });
            });
        },
        combos: async (): Promise<Combo[]> => {
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

                        combos.push({ comboName: comboName.trim(), pizzaIds, specialPrice });
                    });
                return combos;
            });
        }
    }
};

export default api;
