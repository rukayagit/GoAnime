import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnimeData } from '../api/getAnimeData.ts'; // Импорт функции для получения данных
import Header, { headerProp } from "../components/Header.tsx";
import AniCard from "../components/homePage/animeCard.tsx";
import { useAnimeClickHandler } from "../hooks/useAnimeClickHandler.ts";

// Определите тип AnimeData, если это необходимо
interface AnimeData {
    id: number;
    russian: string;
    score: string;
    image_url: string;
}

const headerGaps = {
    gap_first: 110,
    gap_second: 680,
} as headerProp;

// Типизация для объектов order и status
interface Order {
    random: boolean;
    ranked: boolean;
    popularity: boolean;
}

interface Status {
    released: boolean;
    ongoing: boolean;
    all: boolean;
}

// Функция для парсинга modificator
function parseModificator(modificator: string): { order: string; status?: string } {
    const parts = modificator.split('_');

    let order: string;
    let status: string | undefined;

    if (parts.length === 1) {
        order = parts[0];
    } else if (parts.length === 2) {
        order = parts[0];
        status = parts[1];
    } else {
        throw new Error('Неверный формат модификатора');
    }

    return { order, status };
}

export default function AnimeList() {
    const { modificator } = useParams();
    const navigate = useNavigate();
    const { handleCardClick } = useAnimeClickHandler();
    const [animeData, setAnimeData] = useState<AnimeData[]>([]); // Здесь тип AnimeData[]

    const [loading, setLoading] = useState<boolean>(false);

    // Состояния для чекбоксов
    const [order, setOrder] = useState<Order>({
        random: false,
        ranked: false,
        popularity: false,
    });

    const [status, setStatus] = useState<Status>({
        released: false,
        ongoing: false,
        all: false,
    });

    // Эффект для загрузки данных при изменении modificator
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        setLoading(true);

        const { order: parsedOrder, status: parsedStatus } = parseModificator(modificator || '');

        fetchAnimeData({ status: parsedStatus, order: parsedOrder, limit: 15 }, signal)
            .then(setAnimeData)
            .catch((error) => {
                if (error.name === 'AbortError') {
                    console.log('Запрос был отменён');
                } else {
                    console.error('Ошибка при запросе:', error);
                }
            })
            .finally(() => setLoading(false));

        return () => {
            controller.abort(); // Отменяем запросы при размонтировании
        };
    }, [modificator]); // Теперь будет отслеживать изменения `modificator`

    // Обработчик изменений для чекбоксов "order"
    const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        if (checked) {
            // Если выбран новый чекбокс, сбрасываем остальные
            setOrder({
                random: name === 'random',
                ranked: name === 'ranked',
                popularity: name === 'popularity',
            });
        } else {
            // Если чекбокс снят, просто обновляем состояние
            setOrder(prevState => ({
                ...prevState,
                [name]: false,
            }));
        }
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        if (checked) {
            // Если выбран чекбокс, сбрасываем остальные
            setStatus({ released: false, ongoing: false, all: false, [name]: checked });
        } else {
            // Если чекбокс снят, оставляем остальные
            setStatus(prevState => ({
                ...prevState,
                [name as keyof Status]: checked
            }));
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        let modifier = '';

        if (status.all) {
            modifier = Object.keys(order).filter(key => order[key as keyof Order]).join('_');
        } else {
            const orderPart = Object.keys(order).filter(key => order[key as keyof Order]).join('_');
            const statusPart = Object.keys(status).filter(key => status[key as keyof Status] && key !== 'all').join('_');

            modifier = orderPart && statusPart ? `${orderPart}_${statusPart}` : orderPart || statusPart;
        }

        navigate(`/list/${modifier}`);
    };

    return (
        <>
            <Header values={headerGaps} />
            <div className="bg-[#fff] w-[1920px] flex flex-row">
                {loading ? (
                    <p>Загрузка...</p>
                ) : (
                    <div className="ml-[75px] pt-[30px]">
                        <h2 className="font-bold text-[#000] text-[24px] pl-[20px] mb-[20px]">
                            Список аниме
                        </h2>
                        <div className="grid grid-cols-5 w-[1500px] gap-y-[20px] border-r-[1px] border-r-[#A4C2E7]">
                            {animeData.map((anime) => (
                                <AniCard
                                    key={anime.id}
                                    russian={anime.russian}
                                    score={anime.score}
                                    image_url={anime.image_url}
                                    isBig={true}
                                    onClick={() => handleCardClick(anime.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <aside className="flex flex-col pt-[30px] text-[#000] gap-[20px] w-[270px] mr-[75px] items-center">
                    <h3 className="text-[24px] font-bold">Фильтры</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
                        <div className="flex flex-col">
                            <h3 className="mb-[5px] text-[18px]">Сортировка:</h3>
                            <label className="flex flex-row gap-[8px]">
                                <input
                                    type="checkbox"
                                    name="ranked"
                                    checked={order.ranked}
                                    onChange={handleOrderChange}
                                />
                                По рейтингу
                            </label>
                            <label className="flex flex-row gap-[8px]">
                                <input
                                    type="checkbox"
                                    name="popularity"
                                    checked={order.popularity}
                                    onChange={handleOrderChange}

                                />
                                По популярности
                            </label>
                            <label className="flex flex-row gap-[8px]">
                                <input
                                    type="checkbox"
                                    name="random"
                                    checked={order.random}
                                    onChange={handleOrderChange}

                                />
                                Случайно
                            </label>
                        </div>

                        <div className="flex flex-col">
                            <h3 className="mb-[5px] text-[18px]">Статус:</h3>
                            <label className="flex flex-row gap-[8px]">
                                <input
                                    type="checkbox"
                                    name="released"
                                    checked={status.released}
                                    onChange={handleStatusChange}
                                />
                                Уже вышло
                            </label>
                            <label className="flex flex-row gap-[8px]">
                                <input
                                    type="checkbox"
                                    name="ongoing"
                                    checked={status.ongoing}
                                    onChange={handleStatusChange}
                                />
                                Сейчас онгоинг
                            </label>
                            <label className="flex flex-row gap-[8px]">
                                <input
                                    type="checkbox"
                                    name="all"
                                    checked={status.all}
                                    onChange={handleStatusChange}
                                />
                                Все сразу
                            </label>
                        </div>

                        <button type="submit" className="rounded-[10px] py-[5px] bg-[#6D84F9] text-[#fff] px-[10px]">Применить</button>
                    </form>
                </aside>
            </div>
        </>
    );
}
