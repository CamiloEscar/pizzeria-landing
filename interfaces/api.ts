import { Pizza } from "./pizza";
import { Combo } from "./Combo";

const api = {
    pizza: {
        list: async (): Promise<Pizza[]> => {
            try {
                const response = await fetch(
                    "https://docs.google.com/spreadsheets/d/1sAWtNHo2vGtWAZK_bMdCZfkI-oWqGyJ0QY_zms5ZNik/pub?gid=0&single=true&output=tsv"
                );
                const text = await response.text();

                return text.split("\n").slice(1).map((row) => {
                    const [id, name, description, price, halfPrice, image, rating, promotion, receta] = row.split("\t");

                    return {
                        id: parseInt(id.trim()),
                        name: name.trim(),
                        description: description.trim(),
                        price: parseFloat(price.trim()),
                        halfPrice: parseFloat(halfPrice.trim()), // Nueva columna para halfPrice
                        image: image.trim(),
                        rating: parseFloat(rating.trim()),
                        promotion: promotion ? promotion.trim() : undefined,
                        receta: receta ? receta.trim().split(",").map(item => item.trim()) : []
                    } as Pizza;
                });
            } catch (error) {
                console.error("Error fetching pizzas:", error);
                return [];
            }
        },
        combos: async (): Promise<Combo[]> => {
            try {
                const pizzas = await api.pizza.list();

                const response = await fetch(
                    "https://docs.google.com/spreadsheets/d/1sAWtNHo2vGtWAZK_bMdCZfkI-oWqGyJ0QY_zms5ZNik/pub?gid=1122033337&single=true&output=tsv"
                );
                const text = await response.text();

                const combos: Combo[] = [];
                text.split("\n").slice(1).forEach((row) => {
                    const [comboName, pizzaIdsString, specialPriceString, promo] = row.split("\t");

                    if (!comboName || !pizzaIdsString || !specialPriceString) {
                        return;
                    }

                    const pizzaIds = pizzaIdsString.split(",")
                        .map(id => parseInt(id.trim()))
                        .filter(id => !isNaN(id));

                    const specialPrice = parseFloat(specialPriceString.trim().replace(".", "").replace(",", "."));
                    if (isNaN(specialPrice) || specialPrice <= 0) {
                        return;
                    }

                    const originalPrice = pizzaIds.reduce((total, id) => {
                        const pizza = pizzas.find(p => p.id === id);
                        return pizza ? total + pizza.price : total;
                    }, 0);

                    combos.push({
                        comboName: comboName.trim(),
                        pizzaIds,
                        specialPrice,
                        originalPrice,
                        promo: promo ? promo.trim() : undefined
                    });
                });
                return combos;
            } catch (error) {
                console.error("Error fetching combos:", error);
                return [];
            }
        }
    }
};

export default api;
