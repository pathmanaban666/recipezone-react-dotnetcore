import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const RecipeVault = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('/recipeVault');
      setRecipes(response.data);
    } catch (err) {
      setError('Error fetching recipes.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmed) return;

    try {
      await axios.delete(`/recipeVault/${id}`);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (err) {
      alert('Failed to delete recipe.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 lg:mt-20 px-4 py-8">
      <header className="bg-white rounded-lg shadow-md mb-8 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Recipe Vault</h2>
        <p>Access all your saved recipes here, saved directly from your searches.</p>
      </header>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}
      {!error && recipes.length === 0 && (
        <div className="text-center text-gray-500 text-lg mt-10">
          No recipes found in your vault.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">{recipe.recipeName}</h3>
              <div className="flex justify-between items-center gap-2">
                <Link
                  to={`/recipe-vault/${recipe.id}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg text-sm"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(recipe.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeVault;
