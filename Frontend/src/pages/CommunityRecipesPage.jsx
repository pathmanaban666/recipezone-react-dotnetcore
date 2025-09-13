import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

export default function CommunityRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const fetchPublicRecipes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/recipes/public');
      setRecipes(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load public recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRecipes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchTerm, recipes]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600 text-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchPublicRecipes}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mt-20 mb-6">🌍 Community Recipes</h2>
      <div className="mb-8 text-center">
        <input
          type="text"
          className="p-2 border border-2 rounded-lg w-3/4 md:w-1/2"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredRecipes.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No recipes found. Try searching again!</p>
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
                <h3 className="text-xl font-semibold text-gray-900">{recipe.title}</h3>
                <p className="text-gray-600 text-sm">
                  {recipe.description.length > 100
                    ? `${recipe.description.substring(0, 100)}...`
                    : recipe.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/community/recipe/${recipe.id}`}
                    className="group inline-flex items-center bg-blue-500 px-4 py-2 text-sm text-white rounded-md hover:bg-blue-600 transition"
                  >
                    View Details
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
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
