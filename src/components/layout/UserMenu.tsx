import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "../ui/avatar";
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
        className="flex items-center space-x-2 rounded-full p-1 hover:bg-accent"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar className="h-8 w-8">
          <span className="font-medium">{user.email ? user.email.charAt(0).toUpperCase() : "U"}</span>
        </Avatar>
        <span className="hidden md:inline-block text-sm font-medium">{user.email || "Użytkownik"}</span>
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
