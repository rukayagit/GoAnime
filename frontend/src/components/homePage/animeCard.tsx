import bStar from "../../assets/homeSVG/ratingStars/rating_star.svg"
import bStarG from "../../assets/homeSVG/ratingStars/rating_star_gold.svg"
import sStar from "../../assets/homeSVG/ratingStars/s_rating_star.svg"
import sStarG from "../../assets/homeSVG/ratingStars/s_rating_star_gold.svg"
import "../../styles/AnimeCard.css"

export interface aniCardProps{
    russian: string,
    score: string,
    image_url: string,
    isBig: boolean;
    onClick?: () => void;
}

type cardParams = {
    width: number;
    height: number;
    textMax_w: number;
    textMax_h: number;
    fontSize: number;
    textMargin_r: number;
    textMargin_b: number;
    textHeight: number;
}

const bigCardParams: cardParams = {
    width: 250,
    height: 355,
    textMax_w: 150,
    textMax_h: 50,
    fontSize: 14,
    textMargin_r: 15,
    textMargin_b: 10,
    textHeight: 15
}

const smallCardParams: cardParams = {
    width: 160,
    height: 227,
    textMax_w: 100,
    textMax_h: 40,
    fontSize: 10,
    textMargin_r: 10,
    textMargin_b: 6,
    textHeight: 10
}

export default function aniCard({russian, score, image_url, isBig, onClick} : aniCardProps) {
    const starIcon = isBig
        ? (Number(score) >= 8.5 ? bStarG : bStar)
        : (Number(score) >= 8.5 ? sStarG : sStar);
    const params = isBig ? bigCardParams : smallCardParams;
    return (
        <article id="Card" onClick={onClick} className="relative rounded-[15px]" style={{width: `${params.width}px`, height: `${params.height}px`}}>
            <img
                src={image_url}
                alt={russian}
                className="object-cover rounded-[15px]" style={{width: `${params.width}px`, height: `${params.height}px`}}
            />
            <section id="hideSect" className="absolute top-[0px] left-[0px] w-[100%] h-[100%]">
                <div className="absolute bottom-0 left-[0px] w-[100%] h-fit flex flex-col items-end">
                    <div className="flex flex-row items-center justify-center gap-[5px]" style={{marginRight: `${params.textMargin_r}px`}}>
                        <img src={starIcon} alt="" />
                        <p className="select-none text-[14px]" style={{fontSize: `${params.fontSize}px`}}>{score}</p>
                    </div>
                    <div
                        className="select-none block text-right justify-end overflow-hidden text-ellipsis whitespace-normal line-clamp-2"
                        style={{
                            marginBottom: `${params.textMargin_b}px`,
                            lineHeight: `${params.textHeight}px`,
                            fontSize: `${params.fontSize + 2}px`,
                            maxHeight: `${params.textMax_h}px`,
                            maxWidth: `${params.textMax_w}px`,
                            marginRight: `${params.textMargin_r}px`
                        }}
                    >
                        {russian}
                    </div>
                </div>
            </section>
        </article>
    );
}