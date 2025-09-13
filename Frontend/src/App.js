import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import UserRecipeDetails from './pages/UserRecipeDetails';
import CreateRecipe from './pages/CreateRecipe';
import UserRecipes from './pages/UserRecipes';
import UpdateRecipe from './pages/UpdateRecipe';
import CommunityRecipeDetail from './pages/CommunityRecipeDetail';
import CommunityRecipesPage from './pages/CommunityRecipesPage';
import RecipeVault from './pages/RecipeVault';
import RecipeVaultDetail from './pages/RecipeVaultDetail';
import SearchRecipe from './pages/SeachRecipe';
import PrivateRoute from './auth/PrivateRoute';
import Header from './components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerifyOtp from './pages/VerifyOtp';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
        <div className="min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1">
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/create-recipe" element={<PrivateRoute><CreateRecipe /></PrivateRoute>} />
        <Route path="/my-recipes" element={ <PrivateRoute><UserRecipes /></PrivateRoute>} />
        <Route path="/recipes/:id" element={<PrivateRoute><UserRecipeDetails /></PrivateRoute>} />
        <Route path="/update-recipe/:id" element={<PrivateRoute><UpdateRecipe /></PrivateRoute>} />
        <Route path="/community/recipe" element={<CommunityRecipesPage />} />
        <Route path="/community/recipe/:id" element={<CommunityRecipeDetail />} />
        <Route path="/search-recipe" element={<PrivateRoute><SearchRecipe /></PrivateRoute>} />
        <Route path="/recipe-vault" element={<PrivateRoute><RecipeVault /></PrivateRoute>} />
        <Route path="/recipe-vault/:id" element={<PrivateRoute><RecipeVaultDetail /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
        <Footer/>
        <ToastContainer 
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      </div>
    </Router>
  );
};

export default App;
