import React, { useEffect, useRef } from "react";
import NavItem from "./NavItem";
import UserMenuOption from "./UserMenuOption";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; email: string | null };
  onLogout: () => void;
  currentPath: string;
  id?: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  onLogout,
  currentPath,
  id = "mobile-menu",
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/" || currentPath === "/dashboard";
    }
    return currentPath.startsWith(path);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close the menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Focus first menu item when menu opens
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector<HTMLElement>("a, button");
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen]);

  return (
    <div className="md:hidden fixed inset-0 z-50 flex" aria-hidden={!isOpen}>
      {/* Backdrop overlay that can be clicked to close */}
      <button
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Zamknij menu"
        tabIndex={-1} // Not part of the tab order
      />

      <div
        ref={menuRef}
        id={id}
        className="relative ml-auto h-full w-3/4 max-w-sm border-l bg-background p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label="Menu nawigacyjne"
      >
        {/* Close button for better accessibility */}
        <button
          className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:bg-accent"
          onClick={onClose}
          aria-label="Zamknij menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="flex flex-col space-y-6">
          <nav className="flex flex-col space-y-4" aria-label="Menu główne">
            <NavItem href="/" label="Dashboard" isActive={isActive("/")} isMobile />
            <NavItem href="/generate" label="Generowanie" isActive={isActive("/generate")} isMobile />
          </nav>

          <div className="border-t pt-4">
            <div className="flex items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">{user.email || "Użytkownik"}</span>
            </div>
            <div role="menu" aria-label="Opcje użytkownika">
              <UserMenuOption label="Wyloguj" onClick={onLogout} isDanger />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
