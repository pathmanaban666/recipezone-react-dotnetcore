import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center mt-40">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Go back to homepage
      </Link>
    </div>
  );
}
