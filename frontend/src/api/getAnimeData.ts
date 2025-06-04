export interface AnimeData {
    id: number;
    russian: string;
    score: string;
    image_url: string;
}

interface FetchAnimeOptions {
    status?: string; // например: "ongoing", "released"
    order?: string;  // например: "ranked", "popularity"
    limit?: number;  // по умолчанию 6
}

const API_URL = "http://localhost:8080/api/anime";

export async function fetchAnimeData(options: FetchAnimeOptions = {}, signal?: AbortSignal): Promise<AnimeData[]> {
    const { status, order = "ranked", limit = 6 } = options;

    const params = new URLSearchParams({
        limit: limit.toString(),
        order,
    });

    if (status) {
        params.append("status", status);
    }

    const url = `${API_URL}?${params.toString()}`;

    try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
            throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Проверяем, есть ли данные
        if (!data || !data.data) {
            console.warn("Нет данных в ответе:", data);
            return [];
        }

        return data.data.map((anime: AnimeData) => ({
            id: anime.id,
            russian: anime.russian,
            score: anime.score,
            image_url: anime.image_url,
        }));

    } catch (error) {
        if ((error as DOMException).name === 'AbortError') {
            console.log("Запрос был отменён");
            return [];
        }

        console.error("Full error:", error);
        if (error instanceof Error) {
            console.error("Response details:", error.message);
        }
        return [];
    }
}
