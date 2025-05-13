import React, { useState, useRef, useEffect } from "react";
import UserMenuOption from "./UserMenuOption";

interface UserMenuProps {
  user: { id: string; email: string | null };
  onLogout: () => void;
}

export default function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{user.email || "Użytkownik"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-md z-50">
          <div className="p-2">
            <UserMenuOption
              label="Wyloguj"
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              isDanger
            />
          </div>
        </div>
      )}
    </div>
  );
}
