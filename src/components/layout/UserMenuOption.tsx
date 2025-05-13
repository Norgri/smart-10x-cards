import React from "react";

interface UserMenuOptionProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isDanger?: boolean;
  role?: string;
}

export default function UserMenuOption({
  label,
  icon,
  onClick,
  isDanger = false,
  role = "menuitem",
}: UserMenuOptionProps) {
  const baseClasses =
    "flex w-full items-center space-x-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent";
  const textClasses = isDanger ? "text-destructive" : "text-foreground";

  return (
    <button className={`${baseClasses} ${textClasses}`} onClick={onClick} role={role} aria-label={label} tabIndex={0}>
      {icon && (
        <span className="h-4 w-4" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}
