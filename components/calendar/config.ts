export const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const DEFAULT_MONTH_HEIGHT = 300;
export const GAP_AND_PADDING = 46;
export const CELL_ROWS = 6;


export const DRAG_ELASTIC = 0.07;
export const DRAG_CONSTRAINTS_MULTIPLIER = 1.5; // how far up the user can drag (multiplies monthHeight)
export const THRESHOLD_FACTOR = 0.18; // fraction of monthHeight used as swipe threshold


export const SPRING_MAIN = {
    type: "spring",
    stiffness: 380,
    damping: 42,
    mass: 0.9,
} as const;


export const SPRING_SNAP = {
    type: "spring",
    stiffness: 400,
    damping: 45,
} as const;