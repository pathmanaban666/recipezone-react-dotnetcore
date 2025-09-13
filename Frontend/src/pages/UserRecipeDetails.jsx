import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

function UserRecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await axios.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
        setError('Could not load recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirm) return;

    try {
      await axios.delete(`/recipes/${id}`);
      alert("Recipe deleted successfully.");
      navigate('/my-recipes');
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe.");
    }
  };

  const handleUpdate = () => {
    navigate(`/update-recipe/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        Loading recipe details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-20 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">{recipe.title}</h2>

      {recipe.imageUrl ? (
        <div className="flex justify-center mb-6">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mb-6">No image available</p>
      )}

      <div className="space-y-4 text-gray-800">
        <p><strong>Description:</strong> {recipe.description}</p>
        <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
        <p><strong>Instructions:</strong> {recipe.instructions}</p>
        <p><strong>Visibility:</strong> {recipe.isPublic ? 'Everyone can see this recipe through the community' : 'Only you can see this recipe'}</p>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleUpdate}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          to="/my-recipes"
          className="inline-flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Recipes
        </Link>
      </div>
    </div>
  );
}

export default UserRecipeDetails;
