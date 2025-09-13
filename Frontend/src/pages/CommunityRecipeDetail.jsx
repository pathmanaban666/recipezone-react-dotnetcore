import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, Link } from 'react-router-dom';

const CommunityRecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/recipes/public/${id}`);
        setRecipe(response.data);
      } catch {
        setError('Recipe not found or not public.');
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500 text-center text-lg">{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-500 text-center text-lg">Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-16 max-w-4xl p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {recipe.title}
      </h2>

      {recipe.imageUrl && (
        <div className="aspect-[16/9] w-full mb-6 overflow-hidden rounded-lg shadow">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-6">
        <InfoBlock label="Posted By" value={recipe.username} />
        <InfoBlock label="Description" value={recipe.description} />
        <InfoBlock label="Ingredients" value={recipe.ingredients} />
        <InfoBlock label="Instructions" value={recipe.instructions} />
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/community/recipe"
          className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-md transition"
        >
          <svg
            className="mr-2 h-4 w-4 text-white"
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
          Back to Community Recipes
        </Link>
      </div>
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold text-gray-700 mb-2">{label}:</h3>
    <p className="text-gray-600 whitespace-pre-wrap break-words">{value}</p>
  </div>
);

export default CommunityRecipeDetail;
