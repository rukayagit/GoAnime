export type scores = {
    name: number;
    value: number;
};

export const getScoreWidth = (index: number, scores: scores[]) : number => {
    return scores[index].value * 100 / scores[0].value;
}

export const sortScores = (scores: scores[]): scores[] => {
    return scores.sort((a, b) => b.value - a.value);
};