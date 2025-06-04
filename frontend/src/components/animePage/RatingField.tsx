import {sortScores, scores } from "./utils/animePage/ratingFiledUtil.ts";
import RatingBar, {getStars} from "./utils/animePage/UI.tsx";


interface ratingFieldProps {
    id: string
    rating: number
    scores: scores[];
}

export default function RatingField({ id, rating, scores} : ratingFieldProps) {
    scores = sortScores(scores);

    return (
        <section id={id} className="w-[210px] flex flex-col items-center gap-[6px]">
            <div className="inline-flex justify-center w-full h-[17px] text-[#000] text-[14px]">
                <h2>Рейтинг</h2>
            </div>
            <article style={{fontFamily: `Lexend`}} className="flex flex-row justify-center items-center gap-[9px] w-[184px] h-fit">
                <section className="inline-flex h-[22px] gap-[5px]">
                    {getStars(rating)}
                </section>
                <div>
                    <h2 className="text-[#000] text-[24px] relative top-[1px]">{rating}</h2>
                </div>
            </article>
            <aside style={{fontFamily: `Lexend`}} className="flex flex-col justify-center w-[196px] h-[120px] border-r-[0.2px] border-l-[0.2px] border-[#000] ">
                <section className="h-[100px] w-full border-b-[0.2px] border-[#000] flex items-end">
                    {Array.from({ length: 7 }, (_, index) => (
                        <RatingBar key={index} index={index} scores={scores} />
                    ))}
                </section>
                <article className="h-[10px]">

                </article>
            </aside>
        </section>
    )
}