/**
 * ============================================
 * BRANDING CONFIGURATION
 * ============================================
 * Change the app name, logo icon, taglines, etc. here.
 * Every page & component imports from this file.
 */

import { BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const branding = {
  /** Application name shown in headers, auth page, etc. */
  appName: "Learnflow",

  /** Short tagline for the hero section */
  tagline: "Learn smarter, not harder",

  /** Longer description for the landing page */
  description:
    "An adaptive learning platform that personalizes content to your level, tracks your progress, and helps you master any topic.",

  /** The Lucide icon used as the app logo. Swap to any lucide-react icon. */
  logoIcon: BookOpen as LucideIcon,

  /**
   * If you have a custom logo image (e.g. src/assets/logo.png),
   * set this path and the Logo component will render an <img> instead.
   * Set to `null` to use the Lucide icon above.
   *
   * Example: "/logo.png"  (place file in public/)
   * Example: import logo from "@/assets/logo.png"; then set logoImage: logo
   */
  logoImage: null as string | null,

  /** Size classes for the logo container */
  logoSize: {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  },

  /** Size classes for the logo icon inside the container */
  iconSize: {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
  },

  /** Background style for the icon container */
  logoBgClass: "bg-gradient-primary",

  /** Corner rounding for the logo container */
  logoRoundedClass: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
  },
} as const;
