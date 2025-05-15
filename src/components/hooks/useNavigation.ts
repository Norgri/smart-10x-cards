import { useState, useEffect } from "react";

interface UseNavigationResult {
  currentPath: string;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  isActive: (path: string) => boolean;
  handleLogout: () => Promise<void>;
}

/**
 * Custom hook for navigation state management
 */
export function useNavigation(): UseNavigationResult {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get current path on client side
    setCurrentPath(window.location.pathname);

    // Update path on navigation
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      closeMobileMenu();
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/" || currentPath === "/dashboard";
    }
    return currentPath.startsWith(path);
  };

  /**
   * Logout handler that calls the logout API endpoint
   */
  const handleLogout = async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        if (typeof window !== "undefined") {
          window.location.replace("/auth/login");
        }
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    currentPath,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    isActive,
    handleLogout,
  };
}
