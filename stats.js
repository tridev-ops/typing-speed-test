export function calculateWPM(typedCharacters, elapsedSeconds) {
    if (typedCharacters <= 0 || elapsedSeconds <= 0) return 0;
    return Math.round((typedCharacters / 5) / (elapsedSeconds / 60));
}

export function calculateAccuracy(correctCharacters, totalCharacters) {
    if (totalCharacters <= 0) return 100;
    return Math.round((correctCharacters / totalCharacters) * 100);
}

export function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
