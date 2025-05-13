import { Button } from "../ui/button";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import { useNavigation } from "../hooks/useNavigation";

interface NavbarProps {
  user: { id: string; email: string | null };
  onLogout?: () => void; // Opcjonalne
  currentPath?: string; // Opcjonalne
}

export default function Navbar({ user }: NavbarProps) {
  const { currentPath, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, isActive, handleLogout } = useNavigation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="font-bold text-xl">10x Cards</span>
          </a>

          {/* Desktop navigation */}
          <div className="ml-8 hidden md:flex">
            <nav className="flex items-center space-x-6">
              <NavItem href="/" label="Dashboard" isActive={isActive("/")} />
              <NavItem href="/generate" label="Generowanie" isActive={isActive("/generate")} />
            </nav>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* UserMenu visible only on desktop */}
          <div className="hidden md:block">
            <UserMenu user={user} onLogout={handleLogout} />
          </div>

          {/* Mobile menu button */}
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
