import { useEffect, useState, useCallback } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

function UserRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserRecipes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/recipes/user');
      setRecipes(res.data);
    } catch (err) {
      setError('Failed to load your recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserRecipes();
  }, [fetchUserRecipes]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchTerm, recipes]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchUserRecipes}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mt-20 mb-6">🍽️ My Recipes</h2>
      <div className="mb-8 text-center">
        <input
          type="text"
          className="p-2 border-1 rounded-lg w-3/4 md:w-1/2"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-6 text-center">
        <Link
          to="/create-recipe"
          className="inline-block bg-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          ➕ Create New Recipe
        </Link>
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-600">No recipes found. Try a different search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
              {recipe.imageUrl && (
                <div className="aspect-[16/9]">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 truncate">{recipe.title}</h3>
                <p className="text-gray-600 text-sm">
                  {recipe.description.length > 100
                    ? `${recipe.description.slice(0, 100)}...`
                    : recipe.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="group inline-flex items-center justify-center bg-blue-500 px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-blue-600 transition"
                  >
                    View Details
                    <svg
                      className="ml-2 h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserRecipes;
