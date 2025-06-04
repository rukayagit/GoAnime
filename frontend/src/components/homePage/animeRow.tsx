import AniCard from "./animeCard.tsx";
import bigArrow from "../../assets/homeSVG/Arrows/more_big.svg";
import { AnimeData } from "../../api/getAnimeData.ts";
import {useAnimeClickHandler} from "../../hooks/useAnimeClickHandler.ts";
import rightArrow from "../../assets/homeSVG/Arrows/arrow-right.svg";
import {useNavigate} from "react-router-dom";

interface animeRowProps {
    isItLoading : boolean;
    isBig: boolean;
    typeLink: string;
    animeArray: AnimeData[];
    header: string;
    isRanked: boolean;
}

type rowProp = {
    widthSection: number,
    heightSection: number,
    gapSection: number,
    sectionBgGrad: string,
    asideBtnWidth: number,
    asideBtnHeight: number,
}

const smallProp = {
    widthSection: 1920,
    heightSection: 300,
    gapSection: 36,
    sectionBgGrad: "linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, #A4C2E7 10%, #8A99AA 50%, #A4C2E7 90%, rgba(255, 255, 255, 0.20) 100%)",
    asideBtnWidth: 100,
    asideBtnHeight: 227
} as rowProp

const bigProp = {
    widthSection: 1920,
    heightSection: 460,
    gapSection: 36,
    sectionBgGrad: "linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, #A4C2E7 11%, #8A99AA 52%, #A4C2E7 90%, rgba(255, 255, 255, 0.20) 100%)",
    asideBtnWidth: 132,
    asideBtnHeight: 352
} as rowProp


export default function AnimeRow({isItLoading, animeArray, isBig, isRanked, header, typeLink} : animeRowProps) {
    const { handleCardClick } = useAnimeClickHandler();
    const navigate = useNavigate();
    const prop = isBig ? bigProp : smallProp;
    return (
        <section className="flex flex-row items-center px-[36px] py-[52px] relative"
                 style={{background: `${prop.sectionBgGrad}`, gap: `${prop.gapSection}px`, width: `${prop.widthSection}px`, height: `${prop.heightSection}px`}}>
            {isBig ?
                ("")
                :
                (
                    isRanked ? (
                        <div className="absolute top-[-13px] left-[70px] flex flex-row cursor-pointer" onClick={() => navigate("/list/ranked")}>
                            <h2 className="text-[#000] text-[20px]" style={{fontFamily: `Montserrat`}}>{header}</h2>
                            <img src={rightArrow} alt=""/>
                        </div>
                    ) :
                        (
                            <div className="absolute top-[-13px] left-[70px] flex flex-row cursor-pointer" onClick={() => navigate("/list/popularity")}>
                                <h2 className="text-[#000] text-[20px]" style={{fontFamily: `Montserrat`}}>{header}</h2>
                                <img src={rightArrow} alt=""/>
                            </div>
                        )
                )
            }
            {isItLoading ? (
                <div>

                </div>
            ) : (
                animeArray.map((anime) => (
                    <AniCard
                        russian={anime.russian}
                        score={anime.score}
                        image_url={anime.image_url}
                        isBig={isBig}
                        onClick={() => handleCardClick(anime.id)}
                    />
                ))
            )}
            <aside className="w-[132px] h-[352px] flex items-center justify-center rounded-[15px] cursor-pointer"
                   style={{background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), linear-gradient(270deg, rgba(255, 255, 255, 0.20) 0%, rgba(164, 194, 231, 0.20) 50%, rgba(138, 153, 170, 0.20) 100%)`,
                   width: `${prop.asideBtnWidth}px`, height: `${prop.asideBtnHeight}px`
                   }}
                   onClick={() => navigate(`/list/${typeLink}`)}>
                <img src={bigArrow} alt=""/>
            </aside>
        </section>
    )
}