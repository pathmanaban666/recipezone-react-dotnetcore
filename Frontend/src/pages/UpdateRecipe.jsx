import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

function UpdateRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [image, setImage] = useState(null); // new file
  const [existingImageUrl, setExistingImageUrl] = useState(null); // current image

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await axios.get(`/recipes/${id}`);
        const recipe = res.data;

        setTitle(recipe.title);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients);
        setInstructions(recipe.instructions);
        setIsPublic(recipe.isPublic);
        setExistingImageUrl(recipe.imageUrl);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch recipe');
      }
    }

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Title', title);
    formData.append('Description', description);
    formData.append('Ingredients', ingredients);
    formData.append('Instructions', instructions);
    formData.append('IsPublic', isPublic);
    if (image) {
      formData.append('Image', image);
    }

    try {
      await axios.put(`/recipes/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Recipe updated successfully');
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update recipe');
    }
  };

  return (
    <div className="max-w-4xl mt-28 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Update Recipe</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients</label>
          <textarea
            id="ingredients"
            placeholder="Ingredients"
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            id="instructions"
            placeholder="Instructions"
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Image</label>
          {existingImageUrl ? (
            <div className="mt-2">
              <img
                src={existingImageUrl}
                alt={title || "Recipe image"}
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          ) : (
            <span className="text-gray-500">No image uploaded</span>
          )}
        </div>

        <div>
          <label htmlFor="newImage" className="block text-sm font-medium text-gray-700">New Image (optional)</label>
          <input
            type="file"
            id="newImage"
            accept="image/*"
            onChange={e => setImage(e.target.files[0])}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={() => setIsPublic(prev => !prev)}
            className="mr-2"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 cursor-pointer">Share with Community</label>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Update Recipe
          </button>
          <button
            type="button"
            onClick={() => navigate(`/recipes/${id}`)}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateRecipe;
