import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import { UserCircle } from "lucide-react";

export default function NavBar() {
  const { isLoggedIn, logout, username } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();        // For the menu itself
  const toggleRef = useRef();      // For the hamburger/X button

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideMenu = menuRef.current && menuRef.current.contains(event.target);
      const isClickOnToggle = toggleRef.current && toggleRef.current.contains(event.target);

      if (menuOpen && !isClickInsideMenu && !isClickOnToggle) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-6 py-4 shadow-lg fixed w-full z-10 top-0">
      <div className="max-w-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 mx-6">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-wide">
            <Link to="/">🍽️ RecipeZone</Link>
          </div>
        </div>

        {/* Hamburger / X Icon for Mobile */}
        <div className="lg:hidden">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              // X icon
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 font-medium mx-6">
          <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/community/recipe" className="hover:text-yellow-400 transition">Community</Link>

          {isLoggedIn && (
            <>
              <Link to="/search-recipe" className="hover:text-yellow-400 transition">Search</Link>
              <Link to="/recipe-vault" className="hover:text-yellow-400 transition">Recipe Vault</Link>
              <Link to="/my-recipes" className="hover:text-yellow-400 transition">My Recipes</Link>

              <div className="flex items-center gap-3">
                <UserCircle className="w-6 h-6 text-white" />
                <span className="text-xl font-medium">{username}</span>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 px-3 py-1 rounded text-black transition font-semibold bg-white"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden absolute bg-gray-950 top-full left-0 w-full py-6 px-6 shadow-xl animate-slide-down"
        >
          <div className="flex flex-col gap-6 font-semibold text-lg">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Home</Link>
            <Link to="/community/recipe" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Community</Link>

            {isLoggedIn && (
              <>
                <Link to="/search-recipe" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Search</Link>
                <Link to="/recipe-vault" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Recipe Vault</Link>
                <Link to="/my-recipes" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">My Recipes</Link>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-6 h-6 text-white" />
                    <span className="text-xl font-medium">{username}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="hover:text-red-400 px-3 py-1 rounded text-black transition bg-white font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
