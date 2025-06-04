import {useLocation, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import "../styles/AnimePage.css";
import Header, {headerProp} from "../components/Header.tsx";
import AniAbout from "../components/animePage/AniAbout.tsx";
import ThreeCols from "../components/animePage/ThreeColsGrid.tsx";
import {useAnimeClickHandler} from "../hooks/useAnimeClickHandler.ts";


const aniLibriaCache = new Map<string, any>();

const AnimePage = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { handleCardClick } = useAnimeClickHandler();
    const [anime, setAnime] = useState(location.state?.animeData || null);
    const [useAni, setUseAni] = useState(location.state?.useAniData || false);

    useEffect(() => {
        if (!anime && id) {
            const loadAnimeData = async () => {
                const animeDetails = await handleCardClick(Number(id), false); // Используем функцию для получения данных по ID
                setAnime(animeDetails); // Сохраняем данные в состояние
            };

            loadAnimeData(); // Загружаем данные при первом рендере
        }
    }, [id, anime, handleCardClick]);

    useEffect(() => {
        if (!anime || anime.description) return;

        (async () => {
            try {
                let aniData;
                if (aniLibriaCache.has(anime.name)) {
                    aniData = aniLibriaCache.get(anime.name);
                } else {
                    const res = await fetch(`https://api.anilibria.tv/v3/title/search?search=${encodeURIComponent(anime.name)}`);
                    if (!res.ok) throw new Error("Anilibria fetch failed");

                    aniData = await res.json();
                    // Кэшируем данные
                    aniLibriaCache.set(anime.name, aniData);
                }
                const ani = aniData.list?.[0];

                if (ani) {
                    const updatedAnime = {
                        ...anime,
                        genres: ani.genres || anime.genres,
                        description: ani.description || anime.description,
                        anilibria: {
                            genres: ani.genres,
                            description: ani.description
                        }
                    };
                    setAnime(updatedAnime);
                    setUseAni(true);
                }
            } catch (err) {
                console.error("Ошибка загрузки Anilibria:", err);
            }
        })(); // <--- 👈 IIFE
    }, [anime]);

    if (!anime) return <div>Загрузка...</div>;

    const ongoing = anime.status === "ongoing";

    const headerGaps = {
        gap_first: 172,
        gap_second: 557
    } as headerProp;

    return (
        <div className="flex w-[1920px] flex-col justify-center align-center items-center bg-[#fff]">
            <Header values = {headerGaps} />
            <article id="mainAniGrid" className="grid gap-x-[20px] gap-y-[5px] w-[1720px] h-[1000px] px-[20px] bg-[#fff] mt-[30px] border-x-[1px] border-[#A4C2E7]">
                <img id="aniBigPoster" className="w-[320px] h-[453px] rounded-[15px]"
                     src={`https://shikimori.one${anime.image.original}`} alt=""></img>
                <section id="aniButtons" className="flex flex-col gap-[20px] items-center text-[14px] text-[#fff]">
                    <button className="inline-flex justify-center w-[200px] h-[24px] bg-[#6D84F9] rounded-b-[10px] cursor-pointer">Добавить в избранное</button>
                    <section className="flex flex-col gap-[7px] items-center">
                        <button className="inline-flex justify-center w-[185px] rounded-[4px] cursor-pointer" style={{background: `rgba(230, 110, 168, 0.85)`}}>Просмотрено</button>
                        <button className="inline-flex justify-center w-[185px] rounded-[4px] cursor-pointer" style={{background: `rgba(83, 42, 130, 0.85)`}}>Запланировано</button>
                    </section>
                </section>
                <AniAbout ongoing={ongoing} useAni={useAni} anime={anime}/>
                <article id="aniDesc" className="flex flex-col text-[#000] gap-[5px] w-[660px]">
                    <h2 className="text-[20px] ml-[20px]"> Описание </h2>
                    <div className="text-[#000] text-[12px]"> {useAni ? (anime.anilibria.description) : anime.description?.replace(/\[+[^\[\]]*?\]+/g, '') ?? "Описание отсутствует"} </div>
                </article>
                <ThreeCols anime={anime}/>
            </article>
        </div>
    );
};

export default AnimePage;