import { useState, useRef } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("Ingredients", ingredients);
    formData.append("Instructions", instructions);
    formData.append("IsPublic", isPublic);

    if (image) {
      formData.append("Image", image);
    }

    try {
      const response = await axios.post("/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("Recipe created successfully!");
        setTitle("");
        setDescription("");
        setIngredients("");
        setInstructions("");
        setImage(null);
        setIsPublic(true);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";  
      }

    } catch (error) {
      console.error("Error creating recipe:", error);
      const errors = error.response?.data;
      if (Array.isArray(errors)) {
        errors.forEach((err) => toast.error(err.description || "Error creating recipe."));
      } 
      else {
        toast.error(errors?.error || "There was an error creating the recipe.");
      }
    }
  };

  return (
    <div className="max-w-4xl mt-36 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Create New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          <textarea
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            required
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-2 mt-2 flex items-center">
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 mr-4">
            Share with Community
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
            <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-full"></span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
        >
          Create Recipe
        </button>
      </form>
       <Link 
          to="/my-recipes"
          className="group relative inline-flex items-center mt-6 justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors duration-200"
        >
          <svg className="mr-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Recipes
        </Link>
    </div>
  );
};

export default CreateRecipe;
