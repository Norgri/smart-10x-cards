import { Button } from "../ui/button";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import { useNavigation } from "../hooks/useNavigation";

interface NavbarProps {
  user: { id: string; email: string | null };
  onLogout: () => void;
  currentPath: string;
}

export default function Navbar({ user }: NavbarProps) {
  const { currentPath, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, isActive, handleLogout } = useNavigation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">10x Cards</span>
          </a>
        </div>

        <div className="flex-1 hidden md:flex">
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <NavItem href="/" label="Dashboard" isActive={isActive("/")} />
            <NavItem href="/generate" label="Generowanie" isActive={isActive("/generate")} />
          </nav>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <UserMenu user={user} onLogout={handleLogout} />

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMobileMenuOpen ? "hidden" : "block"}
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isMobileMenuOpen ? "block" : "hidden"}
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          user={user}
          onLogout={handleLogout}
          currentPath={currentPath}
          id="mobile-menu"
        />
      )}
    </header>
  );
}
