import { AnimeData } from "./getAnimeData";

const SEARCH_API_URL = import.meta.env.VITE_API_URL + "/anime/search";

export async function searchProcessor(
    query: string,
    signal?: AbortSignal
): Promise<AnimeData[]> {
    if (!query.trim()) return [];

    const url = `${SEARCH_API_URL}?q=${encodeURIComponent(query.trim())}`;

    try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`Ошибка при поиске: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !data.data) {
            console.warn("Пустой ответ от поиска:", data);
            return [];
        }

        return data.data.map((anime: AnimeData) => ({
            id: anime.id,
            russian: anime.russian,
            score: anime.score,
            image_url: anime.image_url,
        }));

    } catch (error) {
        if ((error as DOMException).name === "AbortError") {
            console.log("Поисковый запрос отменён");
            return [];
        }

        console.error("Ошибка в searchProcessor:", error);
        return [];
    }
}
