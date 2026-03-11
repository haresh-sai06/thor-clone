// ─── THOR Animation Variants ───
// Standard Framer Motion variants for consistent animations across the app
import type { Variants } from "motion/react";

const cubicOut: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// Fade up — default page content reveal
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: cubicOut },
  },
};

// Stagger container — wrap lists/grids
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Card hover — for all interactive cards
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -3,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// Slide in from right — for nested route entry
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: cubicOut },
  },
};

// Scale pop — for buttons, badges, icons
export const scalePop: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.94, transition: { duration: 0.1 } },
};

// Tourist page transition
export const touristTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: cubicOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Enterprise page transition — faster
export const enterpriseTransition: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: cubicOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Fade in — simple opacity
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Scale in — for icons, badges
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};
