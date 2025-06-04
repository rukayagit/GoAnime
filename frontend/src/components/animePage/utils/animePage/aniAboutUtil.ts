import {scores} from "./ratingFiledUtil.ts";

const pluralize = (num: number, forms: [string, string, string]) => {
    const n = Math.abs(num) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
};

type anilibria = {
    genres: string[];
    description: string;
}
type studio = {
    name: string;
    filtered_name: string;
    image: string;
}

type genre = {
    "id": number,
    "name": string,
    "russian": string,
    "kind": string,
    "entry_type": string
}

export type image = {
    original: string;
    preview: string;
};

export type video = {
    url: string;
    image_url: string;
    name: string;
    kind: string;
    hosting: string;
};

export type anime = {
    russian: string;
    name: string;
    rating: string;
    status: string;
    next_episode_at: string;
    genres: genre[];
    kind: string;
    episodes: number;
    episodes_aired: number;
    aired_on: string;
    released_on: string;
    duration: number;
    score: number;
    rates_scores_stats: scores[];
    screenshots: image[];
    videos: video[];
    anilibria: anilibria;
    studios: studio[];
}

export const ratingMap: Record<RatingCode, string> = {
    G: "0+",
    pg: "8+",
    pg_13: "13+",
    r: "16+",
    "r+": "16+",
    rx: "18+",
};


export const statusMap: Record<StatusCode, string> = {
    ongoing: "Онгоинг",
    released: "Релиз завершён",
};

export type StatusCode = "ongoing" | "released";

export type RatingCode = "G" | "pg" | "pg_13" | "r" | "r+" | "rx";

export const weekDayFinder = (date: string) : string => {
    if (!date) return "Дата неизвестна";
    const parsedDate = new Date(date);
    const daysOfWeek = [
        'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
        'Четверг', 'Пятница', 'Суббота'
    ];
    return daysOfWeek[parsedDate.getDay()];
}

export const dataParser = (dateStr?: string): string => {
    if (!dateStr) return 'Дата неизвестна';

    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
};

export const watchTimeParser = (duration: number, episodes: number): string => {
    const totalMinutes = duration * episodes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const parts = [];

    if (hours > 0) {
        parts.push(`${hours} ${pluralize(hours, ['час', 'часа', 'часов'])}`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} ${pluralize(minutes, ['минута', 'минуты', 'минут'])}`);
    }
    return parts.join(', ');
};