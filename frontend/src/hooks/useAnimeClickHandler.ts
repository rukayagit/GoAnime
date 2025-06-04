import { useNavigate } from "react-router-dom";

// Простые кэши в памяти
const shikiCache = new Map<number, any>();

export const useAnimeClickHandler = () => {
    const navigate = useNavigate();

    const handleCardClick = async (id: number, navigateOnClick: boolean = true) => {
        try {
            let shikiData;

            if (shikiCache.has(id)) {
                shikiData = shikiCache.get(id);
            } else {
                const shikiRes = await fetch(`https://shikimori.one/api/animes/${id}`, {
                    headers: {
                        'User-Agent': 'anime-library-dev/1.0'
                    }
                });
                if (!shikiRes.ok) throw new Error("Shikimori fetch failed");

                shikiData = await shikiRes.json();
                shikiCache.set(id, shikiData);
            }

            const animeDetails = {
                name: shikiData.name,
                russian: shikiData.russian,
                image: shikiData.image,
                rating: shikiData.rating,
                status: shikiData.status,
                kind: shikiData.kind,
                score: shikiData.score,
                episodes: shikiData.episodes,
                episodes_aired: shikiData.episodes_aired,
                duration: shikiData.duration,
                released_on: shikiData.released_on,
                aired_on: shikiData.aired_on,
                next_episode_at: shikiData.next_episode_at,
                rates_scores_stats: shikiData.rates_scores_stats,
                studios: shikiData.studios,
                videos: shikiData.videos,
                screenshots: shikiData.screenshots,
                description: shikiData.description,
                genres: shikiData.genres,
                anilibria: undefined,
            };

            if (navigateOnClick) {
                navigate(`/anime/${id}`, {
                    state: {
                        animeData: animeDetails,
                        useAniData: false,
                    }
                });
            }

            return animeDetails;

        } catch (error) {
            console.error("Ошибка при загрузке:", error);
            alert("Не удалось загрузить данные об аниме.");
        }
    };


    return { handleCardClick };
};
