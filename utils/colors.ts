const clamp = (v: number, a = 0, b = 255) => Math.max(a, Math.min(b, Math.round(v)));

function hexToRgb(hex: string) {
    if (!hex) return {r: 255, g: 255, b: 255};
    const h = hex.replace('#', '');
    if (h.length === 3) {
        return {
            r: parseInt(h[0] + h[0], 16),
            g: parseInt(h[1] + h[1], 16),
            b: parseInt(h[2] + h[2], 16),
        };
    }
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
}

function rgbToHex(r: number, g: number, b: number) {
    return (
        '#' +
        [r, g, b]
            .map((v) => {
                const s = clamp(v).toString(16);
                return s.length === 1 ? '0' + s : s;
            })
            .join('')
    );
}

export function lightenHex (hex: string, percent: number) {
    const {r, g, b} = hexToRgb(hex);
    const nr = clamp(r + (255 - r) * (percent / 100));
    const ng = clamp(g + (255 - g) * (percent / 100));
    const nb = clamp(b + (255 - b) * (percent / 100));
    return rgbToHex(nr, ng, nb);
}

export function getContrastColor(hex: string) {
    const {r, g, b} = hexToRgb(hex);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#000000' : '#ffffff';
}