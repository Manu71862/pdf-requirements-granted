/**
 * ============================================
 * ANIMATION VARIANTS (Framer Motion)
 * ============================================
 * Central place for all reusable animation configs.
 * Import these in any component instead of inline objects.
 */

import type { Variants, Transition } from "framer-motion";

// ─── Transitions ───────────────────────────────
export const transitions = {
  /** Default spring for most UI elements */
  spring: { type: "spring", stiffness: 300, damping: 24 } as Transition,
  /** Quick ease-out for subtle moves */
  quick: { duration: 0.3, ease: "easeOut" } as Transition,
  /** Smooth entrance for hero content */
  hero: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as Transition,
  /** Stagger children delay */
  stagger: (i: number, base = 0.05) => ({ delay: i * base }) as Transition,
} as const;

// ─── Entrance Variants ─────────────────────────
/** Fade up — the default page/section entrance */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/** Fade in without translation */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Slide from right (for step transitions) */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

/** Slide from left */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

/** Scale in (for cards, modals) */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

/** Collapse/expand (for accordion, domain picker) */
export const collapse: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

// ─── Staggered Container ───────────────────────
/** Wrap children in this to stagger their entrance */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

/** Each staggered child uses this */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

// ─── Chat / Message Animations ─────────────────
export const messageIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ─── Loading / Spinner ─────────────────────────
export const pulseLoop: Variants = {
  hidden: { opacity: 0.5 },
  visible: {
    opacity: 1,
    transition: { repeat: Infinity, repeatType: "reverse", duration: 0.8 },
  },
};
