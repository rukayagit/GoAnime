import "../styles/Home.css";
import { useEffect, useState } from "react";
import { fetchAnimeData, AnimeData } from "../api/getAnimeData";
import rightArrow from "../assets/homeSVG/Arrows/arrow-right.svg";
import Header, { headerProp } from "../components/Header.tsx";
import AnimeRow from "../components/homePage/animeRow.tsx";
import {useNavigate} from "react-router-dom";

export default function AnimeList() {
    const [ongoingAnime, setOngoingAnime] = useState<AnimeData[]>([]);
    const [rankedAnime, setRankedAnime] = useState<AnimeData[]>([]);
    const [popularAnime, setPopularAnime] = useState<AnimeData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const controllers = [new AbortController(), new AbortController(), new AbortController()];

        setLoading(true);

        Promise.all([
            fetchAnimeData({ status: "ongoing", order: "popularity" }, controllers[0].signal).then(setOngoingAnime),
            fetchAnimeData({ order: "ranked", limit: 9}, controllers[1].signal).then(setRankedAnime),
            fetchAnimeData({ order: "popularity", limit: 9 }, controllers[2].signal).then(setPopularAnime),
        ])
            .catch(console.error)
            .finally(() => setLoading(false));

        return () => {
            controllers.forEach(c => c.abort());
        };
    }, []);


    const headerGaps = {
        gap_first: 110,
        gap_second: 680,
    } as headerProp;

    if(loading) {
        return (
            <>
            </>
        )
    }

    return (
        <div className="w-[1920px] bg-[#fff]">
            <Header values={headerGaps} />
            <main>
                <article id="ongoing" className="flex flex-col">
                    <aside className="flex flex-row items-center text-[#000] text-[24px] ml-[70px] mt-[10px] relative bottom-[-10px] w-fit cursor-pointer"
                           onClick={() => navigate("/list/ongoing_popularity")}>
                        <h2 style={{ fontFamily: `Montserrat` }}>Сейчас на экранах</h2>
                        <img src={rightArrow} alt="" />
                    </aside>
                    <AnimeRow
                        isItLoading={loading}
                        animeArray={ongoingAnime}
                        isBig={true}
                        header={""}
                        typeLink={"popularity_ongoing"}
                        isRanked={false}
                    />
                </article>

                <section className="flex flex-row gap-[4px]">
                    <article>
                        <AnimeRow
                            isItLoading={loading}
                            animeArray={rankedAnime}
                            isBig={false}
                            header={"По рейтингу"}
                            typeLink={"ranked"}
                            isRanked={true}
                        />
                        <AnimeRow
                            isItLoading={loading}
                            animeArray={popularAnime}
                            isBig={false}
                            header={"Популярное"}
                            typeLink={"popularity"}
                            isRanked={false}
                        />
                    </article>
                </section>
            </main>
        </div>
    );
}
