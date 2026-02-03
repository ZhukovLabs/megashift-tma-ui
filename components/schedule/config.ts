export const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const CELL_ROWS = 6;

export const DRAG_ELASTIC = 0.07;
export const DRAG_CONSTRAINTS_MULTIPLIER = 1.5;
export const THRESHOLD_FACTOR = 0.15;

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
