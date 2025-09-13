import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, form);
      login(res.data.token, res.data.username);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      const errors = err.response?.data;

      if (Array.isArray(errors)) {
        errors.forEach((error) => {
          toast.error(error.description);
        });
      } else {
        const message = errors?.description || "Invalid credentials.";
        toast.error(message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-36 lg:mt-60 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Login
        </button>
      </form>

      <p className="text-center mt-4">
        Not registered yet?{" "}
        <Link to="/register" className="text-blue-600 hover:text-blue-800">
          Register here
        </Link>
      </p>
    </div>
  );
}
