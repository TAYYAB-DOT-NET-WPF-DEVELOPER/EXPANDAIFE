export function textToBullets(text) {
    if (!text) return [];

    return text
        .split(/\n|[-*•]|\\n/)
        .map(t => t.trim())
        .filter(t => t.length > 0);
}
