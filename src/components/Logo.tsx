/**
 * ============================================
 * APP LOGO COMPONENT
 * ============================================
 * Renders either a custom image or a Lucide icon
 * based on branding config. Use size="sm"|"md"|"lg".
 */

import { branding } from "@/lib/branding";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  nameClassName?: string;
  className?: string;
}

export function Logo({ size = "md", showName = true, nameClassName, className }: LogoProps) {
  const Icon = branding.logoIcon;

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <div
        className={`${branding.logoSize[size]} ${branding.logoRoundedClass[size]} ${branding.logoBgClass} flex items-center justify-center`}
      >
        {branding.logoImage ? (
          <img
            src={branding.logoImage}
            alt={branding.appName}
            className={`${branding.iconSize[size]} object-contain`}
          />
        ) : (
          <Icon className={`${branding.iconSize[size]} text-primary-foreground`} />
        )}
      </div>
      {showName && (
        <span className={nameClassName ?? "font-display font-bold text-foreground"}>
          {branding.appName}
        </span>
      )}
    </div>
  );
}
