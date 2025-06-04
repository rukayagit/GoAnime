import RatingField from "./RatingField.tsx";
import ytButton from "../../assets/aniPageSVG/youtubePlayButton.svg";
import {anime, image, video} from "./utils/animePage/aniAboutUtil.ts";

interface threeColsProps {
    anime: anime;
}

export default function ThreeCols({anime}: threeColsProps) {
    return (
        <section id="threeColsGrid" className="grid gap-[14px] w-[660px] h-[600px]">
            <aside id="mt" className="w-[211px]">

            </aside>
            <RatingField id="aniRating" rating={anime.score} scores={anime.rates_scores_stats}/>

            <section id="aniRating" className="w-[210px]">

            </section>
            <aside id="aniMedia" className="flex flex-col gap-[9px] items-center w-[211px]">
                <div className="w-[211px] h-[20px] text-[15px] text-[#000]">
                    <h2>Кадры:</h2>
                </div>
                {anime.screenshots.map((screenshot: image, index: number) => (
                        <img key={index} src={`https://shikimori.one${screenshot.original}`} alt=""
                             className="w-[211px] rounded-[4px]"/>
                    )
                )}
                <div className="w-[211px] h-[20px] text-[15px] text-[#000]">
                    <h2>Связанные видео:</h2>
                </div>
                <article className="flex flex-col gap-[0px] items-center w-[211px]">
                    {anime.videos.map((video: video, index: number) => (
                            <section key={index}>
                                <article
                                    className="group relative flex justify-center align-center items-center h-[118px] overflow-hidden">
                                    <img src={`${video.image_url}`} alt=""
                                         className="object-cover w-full h-full rounded-tr-[5px] rounded-tl-[5px] rounded-bl-[5px]"/>
                                    <img src={ytButton}
                                         className="w-[11px] h-[11px] absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                         alt=""/>
                                    <div
                                        className="absolute text-[#000] h-fit w-fit rounded-tl-[2px] text-[8px] bg-[#8A9AFF] bottom-[0px] right-[0px] px-[5px] ">
                                        {video.kind}
                                    </div>
                                </article>
                                <div
                                    className="h-[15px] w-[211px] flex justify-center align-center px-[2px] text-[8px] text-[#000]">
                                    <h3> {video.name}</h3>
                                </div>
                            </section>
                        )
                    )}
                </article>
            </aside>
        </section>
    )
}