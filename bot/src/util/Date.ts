export function isWithin(
    dateA: Date | number,
    dateB: Date | number,
    thresholdMiliseconds: number,
) {
    const timeA = dateA instanceof Date ? dateA.getTime() : dateA;
    const timeB = dateB instanceof Date ? dateB.getTime() : dateB;
    return Math.abs(timeA - timeB) / 1000 > thresholdMiliseconds;
}
