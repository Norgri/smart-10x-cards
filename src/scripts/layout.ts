// Define window type
export {};

declare global {
  interface Window {
    handleNavbarLogout: () => Promise<void>;
  }
}

// Handle logout functionality
document.addEventListener("astro:page-load", () => {
  // Logout function
  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/auth/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Make the logout function globally available
  window.handleNavbarLogout = handleLogout;

  // Also handle logout button if present
  const logoutBtn = document.querySelector("[data-logout]");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
});
