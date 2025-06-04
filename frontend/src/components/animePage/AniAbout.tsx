import {
    anime,
    dataParser, ratingMap, statusMap,
    watchTimeParser,
    weekDayFinder
} from "./utils/animePage/aniAboutUtil.ts";
import {genresParser, InfoRow, RoundedInfoRow} from "./utils/animePage/UI.tsx";

interface aniAboutProps {
    ongoing: boolean;
    useAni: boolean;
    anime: anime;
}

export default function AniAbout({ongoing, useAni, anime} : aniAboutProps) {
    return (
        <section id="aniAbout" style={{fontFamily: `Montserrat`}}
                 className="flex flex-col justify-end pb-[10px] gap-[10px] w-[660px] h-[453px] pt-[20px]">
            <h1 className="text-[40px] font-[400] max-w-[660px] text-[#000]">{anime.russian}</h1>
            <h2 className="text-[12px] font-[400] max-w-[320px] text-[#000]">{anime.name}</h2>
            <div className="w-[320px] h-[0.5px] bg-[#000]"></div>
            <aside className="flex flex-row gap-[20px] text-[11px]">
                <RoundedInfoRow value={ratingMap[anime.rating as keyof typeof ratingMap] ?? "N/A"}/>
                <RoundedInfoRow value={statusMap[anime.status as keyof typeof statusMap] ?? "N/A"}/>
                {
                    ongoing ? (
                        <RoundedInfoRow value={weekDayFinder(anime.next_episode_at)}/>
                        ) :
                        null
                }
            </aside>

            <aside className="flex flex-row gap-[20px] text-[11px]">
                {genresParser(useAni ? anime.anilibria.genres || [] : anime.genres || [], useAni)}
            </aside>
            <article className="flex flex-col text-[#000]">
                <InfoRow label={"Тип: "} value={anime.kind.toUpperCase()}/>
                <InfoRow label={"Студия: "} value={!anime.studios[0] ? ("-") : anime.studios[0].name}/>
                <InfoRow label={`${ongoing ? 'Планируется' : 'Всего'} эпизодов: `} value={anime.episodes === 0 ? ("Неизвестно") : (anime.episodes)}/>
                {ongoing ? (
                    <>
                        <InfoRow  label={"Эпизодов вышло: "} value={anime.episodes_aired}/>
                        <InfoRow  label={"Дата следующего эпизода: "} value={dataParser(anime.next_episode_at)}/>
                        <InfoRow  label={"Дата начала: "} value={dataParser(anime.aired_on)}/>
                    </>
                ) : (
                    <>
                        <InfoRow  label={"Статус: "} value={statusMap[anime.status as keyof typeof statusMap] ?? "N/A"}/>
                        <InfoRow label={"Дата релиза: "} value={dataParser(anime.released_on)}/>
                    </>
                )}
                <InfoRow  label={"Длительность эпизода: "} value={`~${anime.duration} мин`}/>
                <InfoRow  label={"Общее время просмотра: "} value={watchTimeParser(anime.duration, ongoing ? anime.episodes_aired : anime.episodes)}/>
            </article>
            <button className="w-[145px] h-[24px] flex justify-center align-center px-[2px] py-[3px] text-[#fff] text-[12px] rounded-[10px] bg-[#6D84F9]">
                Смотреть с 1 серии
            </button>
        </section>
    )
}