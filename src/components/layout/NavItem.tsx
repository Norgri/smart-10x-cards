import React from "react";

interface NavItemProps {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isMobile?: boolean;
}

export default function NavItem({ label, href, icon, isActive = false, isMobile = false }: NavItemProps) {
  const baseClasses = "flex items-center space-x-2 text-sm font-medium transition-colors";
  const activeClasses = isActive ? "text-primary" : "text-muted-foreground hover:text-primary";
  const mobileClasses = isMobile ? "w-full px-3 py-2" : "";

  return (
    <a
      href={href}
      className={`${baseClasses} ${activeClasses} ${mobileClasses}`}
      aria-current={isActive ? "page" : undefined}
      role="menuitem"
    >
      {icon && (
        <span className="h-4 w-4" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </a>
  );
}
