import { Pizza } from "./pizza";

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
                        const [id, name, description, price, image, rating] = row.split("\t");

                        return {
                            id: parseInt(id.trim()),          // Convertir id a número
                            name: name.trim(),
                            description: description.trim(),
                            price: parseFloat(price.trim()),  // Convertir price a número
                            image: image.trim(),
                            rating: parseFloat(rating.trim()), // Convertir rating a número
                        };
                    }) as Pizza[];  // Asegurarse de que el tipo devuelto sea Pizza[]
            });
        }
    }
};

export default api;
