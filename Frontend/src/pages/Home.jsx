import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();
  
  return (
    <div className="min-h-screen  mt-40 via-white to-green-100">
      <header className="text-center py-16 px-4">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">
       Welcome to RecipeZone
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6">
          Discover new recipes, save your desired recipes in Recipe Vault, and share your own recipes in Community. Your personal cooking companion.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          {isLoggedIn ? (
            <>
              <Link
                to="/search-recipe"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow-lg transition"
              >
                Search Recipes
              </Link>
              <Link
                to="/my-recipes"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded shadow-lg transition"
              >
                My Recipes
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow-lg transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded shadow-lg transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">🔍 Smart Recipe Search</h3>
          <p className="text-gray-600">
            Enter a recipe name and get the ingredients and instructions to make the recipe.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">❤️ Save Your Recipes</h3>
          <p className="text-gray-600">
            Keep a personal list of your desired dishes and view them whenever you want.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">📤 Share Your Creations</h3>
          <p className="text-gray-600">
            Create, update, and showcase your own recipes in our Community.
          </p>
        </div>
      </section>
    </div>
  );
}