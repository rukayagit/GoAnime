import {getScoreWidth, scores} from "./ratingFiledUtil.ts";
import React, {JSX} from "react";
import Star25 from "../../../../assets/aniPageSVG/ratingStars/rating_star_gold_1.svg?react";
import Star50 from "../../../../assets/aniPageSVG/ratingStars/rating_star_gold_2.svg?react";
import Star75 from "../../../../assets/aniPageSVG/ratingStars/rating_star_gold_3.svg?react";
import StarFull from "../../../../assets/aniPageSVG/ratingStars/rating_star_gold_full.svg?react";
import Star from "../../../../assets/aniPageSVG/ratingStars/rating_star.svg?react";

interface ratingBarProps {
    index: number;
    scores: scores[];
}

export default function RatingBar({ index, scores } : ratingBarProps ){
    const barHeight = getScoreWidth(index, scores)
    const isShort = barHeight <= 14;
    return (
        <article style={{height: `${barHeight}%`}} className="w-[28px] flex flex-col justify-end items-center">
            <div  className="relative w-[24px] text-[#000] h-full rounded-t-[3px] bg-[#FFDB6E] inline-flex justify-center">
                {
                    isShort ? (
                        <h3 className="text-[11px] relative bottom-[14px]">{scores[index].name}</h3>
                    ) : (
                        <h3 className="text-[11px]">{scores[index].name}</h3>
                    )
                }
                <h3 className="text-[8px] absolute bottom-[-14px]">{scores[index].value}</h3>
            </div>

        </article>
    )
}

export const genresParser = (genres: any[] = [], useAni: boolean) => {
    return genres.map((genre: any, index: number) => (
        <div
            key={index}
            className="flex items-center justify-center px-[10px] py-[5px] text-[#000] rounded-[10px] border-[1.5px] border-[#008EC2]"
        >
            {useAni ? genre : genre.russian}
        </div>
    ));
};

interface InfoRowProps {
    label: string;
    value: string | number | React.ReactNode;
}

export const InfoRow = ({ label, value } : InfoRowProps) => (
    <section className="flex flex-row text-[12px] gap-[5px]">
        <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>{label}</span>
        <p>{value}</p>
    </section>
);

interface roundedInfoRowProps {
    value: string;
}

export const RoundedInfoRow = ({value} : roundedInfoRowProps) => {
    return (
        <section
            className="flex items-center justify-center px-[10px] py-[5px] text-[#000] rounded-[20px] border-[1.5px] border-[#7E86FF]">
            {value}
        </section>
    )
}

export const getStars = (rating: number): JSX.Element[] => {
    const maxStars = 5;
    const stars = [];
    const fullStars = Math.floor(rating / 2);
    const decimalPart = (rating / 2) - fullStars;

    for (let i = 0; i < fullStars; i++) {
        stars.push(<StarFull key={`full-${i}`} />);
    }

    if (stars.length < maxStars) {
        if (decimalPart > 1.5) stars.push(<StarFull key="extra-full" />);
        else if (decimalPart > 1) stars.push(<Star75 key="star-75" />);
        else if (decimalPart > 0.5) stars.push(<Star50 key="star-50" />);
        else if (decimalPart > 0) stars.push(<Star25 key="star-25" />);
    }

    while (stars.length < maxStars) stars.push(<Star key={`empty-${stars.length}`} />);

    return stars;
};