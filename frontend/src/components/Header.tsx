import homePic from "../assets/homeSVG/headerBar/home.svg";
import ongoingPic from "../assets/homeSVG/headerBar/ongoing.svg";
import bestPic from "../assets/homeSVG/headerBar/best.svg";
import popularPic from "../assets/homeSVG/headerBar/popular.svg";
import searchPic from "../assets/homeSVG/headerBar/search.svg";
import zoloPic from "../assets/homeSVG/headerBar/i.webp";
import {useNavigate} from "react-router-dom";
import {getStars} from "./animePage/utils/animePage/UI.tsx";
import {useEffect, useRef, useState} from "react";

import {searchProcessor} from "../api/searchEngine.ts";

interface headerProps {
    values: headerProp;
}

export type headerProp = {
    gap_first: number;
    gap_second: number;
}

type Anime = {
    russian: string;
    score: string;
    image_url: string;
};

export default function Header({values}: headerProps) {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [isActive, setIsActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isActive) return;

        const controller = new AbortController();
        const interval = setInterval(async () => {
            if (query.trim() === "") {
                setAnimeList([]);
                return;
            }

            try {
                const results = await searchProcessor(query, controller.signal);
                setAnimeList(results || []);
            } catch (err) {
                console.error("Ошибка:", err);
            }
        }, 500);

        return () => {
            clearInterval(interval);
            controller.abort();
        };
    }, [query, isActive]);


    return (
        <header className="h-[88px] flex flex-row items-center bg-[#A4C2E7] w-[1920px]"
                style={{gap: `${values.gap_first}px`}}>
            <nav
                className="flex flex-row gap-[40px] items-center bg-[#fff] px-[36px] py-[5px] w-[463px] h-fit rounded-[10px] ml-[100px]">
                <section id="mainpage" className="flex flex-col items-center cursor-pointer"
                         onClick={() => navigate("/home")}>
                    <img src={homePic} className="w-[24px] h-[24px]" alt=""/>
                    <h3 className="text-[#000] text-[14px]">Главная</h3>
                </section>
                <section id="airing" className="flex flex-col items-center cursor-pointer"
                         onClick={() => navigate("/list/popularity_ongoing")}>
                    <img src={ongoingPic} className="w-[24px] h-[24px]" alt=""/>
                    <h3 className="text-[#000] text-[14px]">Онгоинг</h3>
                </section>
                <section id="best" className="flex flex-col items-center cursor-pointer"
                         onClick={() => navigate("/list/ranked")}>
                    <img src={bestPic} className="w-[24px] h-[24px]" alt=""/>
                    <h3 className="text-[#000] text-[14px]">Лучшее</h3>
                </section>
                <section id="popular" className="flex flex-col items-center cursor-pointer"
                         onClick={() => navigate("/list/popularity")}>
                    <img src={popularPic} className="w-[24px] h-[24px]" alt=""/>
                    <h3 className="text-[#000] text-[14px]">Популярное</h3>
                </section>
            </nav>
            <section className="w-[455px]" style={{marginLeft: `${values.gap_second - values.gap_first}px`}}>
                <article
                    className="h-[52px] flex flex-row items-center gap-[6px] bg-[#fff] rounded-[10px] w-[455px]">
                    <img src={searchPic} alt="" className="ml-[6px]"/>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Поиск"
                        className="text-[#000] w-[400px]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsActive(true)}
                        onBlur={() => setTimeout(() => setIsActive(false), 300)}
                    />
                </article>

                {animeList.length > 0 && (
                    <section className="w-[455px] absolute h-fit z-2">
                        {animeList.map((anime, index) => (
                            <div key={index}>
                                <article
                                    className="h-[100px] bg-[#fff] flex flex-row gap-[10px] px-[5px] text-[#000] items-center">
                                    <img src={anime.image_url} alt="" className="max-h-[85px]"/>
                                    <h3 className="w-[250px] text-[20px]">{anime.russian}</h3>
                                    <div className="flex flex-col items-center gap-[4px]">
                                        <p className="text-[24px]" style={{fontFamily: `Lexend`}}>{anime.score}</p>
                                        <section className="inline-flex h-[22px] gap-[5px]">
                                            {getStars(parseFloat(anime.score))}
                                        </section>
                                    </div>
                                </article>
                                {index !== animeList.length - 1 && (
                                    <div className="h-[2px] bg-[#666666] w-full"></div>
                                )}
                            </div>
                        ))}
                    </section>
                )}
            </section>

            <section className="w-[74px] h-[74px] flex flex-row rounded-[10px] items-center bg-[#fff]">
                <img src={zoloPic} alt="" className="ml-[7px] rounded-[10px] w-[60px] h-[60px]"/>
            </section>
        </header>
    )
}