// Base game constants
export const INITIAL_LIVES = 5;
export const TIME_ATTACK_DURATION = 60; // seconds

// Base values for target behavior (used for MEDIUM difficulty)
export const BASE_RADIUS = 35; // px
export const MIN_RADIUS = 5;  // px
export const DIFFICULTY_SCALE = 1000; // Score required for 1x difficulty multiplier increase
export const MIN_SPAWN_RATE = 600; // ms

// --- DIFFICULTY SETTINGS ---
export const DIFFICULTY_LEVELS = {
    easy: {
        id: 'easy',
        label: 'Easy (Recruit)',
        desc: 'Slower targets, more forgiving lives, and gentle scaling.',
        color: 'text-green-400',
        initialLives: 7,
        maxTargets: 6,
        initialSpawnRate: 2500, // slower spawn
        shrinkSpeedFactor: 0.7, // slower shrink
    },
    medium: {
        id: 'medium',
        label: 'Medium (Veteran)',
        desc: 'Balanced challenge with moderate scaling and standard settings.',
        color: 'text-yellow-400',
        initialLives: 5,
        maxTargets: 8,
        initialSpawnRate: 2000,
        shrinkSpeedFactor: 1.0,
    },
    hard: {
        id: 'hard',
        label: 'Hard (Elite)',
        desc: 'Fast targets, aggressive scaling, and less room for error.',
        color: 'text-red-400',
        initialLives: 3,
        maxTargets: 10,
        initialSpawnRate: 1500, // faster spawn
        shrinkSpeedFactor: 1.3, // faster shrink
    },
};

// --- THEME CONFIGURATION ---
export const THEMES = {
    default: {
        id: "default",
        label: "Stealth Ops",
        appBg: "bg-slate-950",
        panelBg: "bg-slate-800",
        panelBorder: "border-slate-700",
        textMain: "text-white",
        textSec: "text-slate-400",
        accentBg: "bg-green-500",
        accentBgHover: "hover:bg-green-600",
        accentText: "text-green-400",
        accentBorder: "border-green-500",
        hudBg: "bg-slate-900",
        inputBg: "bg-slate-900",
        titleGradient: "from-green-400 to-blue-500",
    },
    light: {
        id: "light",
        label: "Clean Lab",
        appBg: "bg-slate-100",
        panelBg: "bg-white",
        panelBorder: "border-slate-200",
        textMain: "text-slate-900",
        textSec: "text-slate-500",
        accentBg: "bg-blue-600",
        accentBgHover: "hover:bg-blue-700",
        accentText: "text-blue-600",
        accentBorder: "border-blue-600",
        hudBg: "bg-white",
        inputBg: "bg-slate-50",
        titleGradient: "from-blue-600 to-cyan-500",
    },
    crimson: {
        id: "crimson",
        label: "Red Alert",
        appBg: "bg-neutral-950",
        panelBg: "bg-neutral-900",
        panelBorder: "border-red-900/50",
        textMain: "text-red-50",
        textSec: "text-red-400/60",
        accentBg: "bg-red-600",
        accentBgHover: "hover:bg-red-700",
        accentText: "text-red-500",
        accentBorder: "border-red-600",
        hudBg: "bg-black",
        inputBg: "bg-black",
        titleGradient: "from-red-500 to-orange-600",
    },
    matrix: {
        id: "matrix",
        label: "The Grid",
        appBg: "bg-black",
        panelBg: "bg-zinc-900",
        panelBorder: "border-green-800",
        textMain: "text-green-50",
        textSec: "text-green-800",
        accentBg: "bg-green-700",
        accentBgHover: "hover:bg-green-600",
        accentText: "text-green-500",
        accentBorder: "border-green-500",
        hudBg: "bg-zinc-950",
        inputBg: "bg-black",
        titleGradient: "from-green-500 to-emerald-400",
    },
};