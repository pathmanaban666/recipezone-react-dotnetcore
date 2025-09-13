import { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

export default function SearchRecipe() {
  const [recipeName, setRecipeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInstructions("");

    if (recipeName.trim().length < 3) {
      toast.error("Please enter a valid recipe name.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/search", { recipeName });
      setInstructions(response.data.instructions);
    } catch (err) {
      const errors = err.response?.data;

      if (Array.isArray(errors)) {
        errors.forEach((error) => toast.error(error.description));
      } else {
        toast.error(errors?.error || "Failed to fetch recipe.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("/recipeVault", { recipeName, instructions });
      toast.success("Recipe saved to Recipe Vault!");
    } catch (err) {
      const errors = err.response?.data;

      if (Array.isArray(errors)) {
        errors.forEach((error) => toast.error(error.description));
      } else {
        toast.error(errors?.error || "Failed to save the recipe.");
      }
    }
  };

  const handleClear = () => {
    setRecipeName("");
    setInstructions("");
  };

  return (
    <div className="mt-40 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800" >
          Search Recipe 🍳
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter a recipe name (e.g., chocolate cake)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Getting..." : "Get Recipe"}
          </button>
        </form>

        {instructions && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Solution:</h2>
            <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-md max-h-[400px] overflow-y-auto">
              {instructions.replace(/title:/gi, "Recipe Name:")}
            </pre>

            <div className="mt-4 flex gap-4">
              <button
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                onClick={handleSave}
              >
                Save to Recipe Vault
              </button>

              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
