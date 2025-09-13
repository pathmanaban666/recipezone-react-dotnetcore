import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';

const RecipeVaultDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`/recipeVault/${id}`);
        setRecipe(response.data);
      } catch (err) {
        setError('Error fetching recipe details.');
      }
    };
    fetchRecipeDetails();
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto mt-20 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong> {error}
        </div>
        <Link
          to="/recipe-vault"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          ⬅️ Back to Vault
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto mt-20 px-4">
        <div className="min-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg shadow-inner">
          <p className="text-lg font-medium text-gray-600">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-20 px-4 py-8">
      <header className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{recipe.recipeName}</h1>

        <Link
          to="/recipe-vault"
          className="group inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Recipe Vault
        </Link>
      </header>
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recipe Info</h2>
        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {recipe.instructions || 'No instructions provided.'}
        </div>
      </section>
    </div>
  );
};

export default RecipeVaultDetail;
