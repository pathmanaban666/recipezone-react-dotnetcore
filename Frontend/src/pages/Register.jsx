import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);


  const otp_session = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let value = '';
      for (let i = 0; i < 23; i++) {
        value += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      const expiry = Date.now() + 300000; 
      return { value, expiry };
  }


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
        form
      );

      toast.success("OTP sent to your email.");
      const otpObj = otp_session();
      localStorage.setItem("otp_session", JSON.stringify(otpObj));
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      const errors = err.response?.data;

      if (Array.isArray(errors)) {
        errors.forEach((error) => {
          toast.error(error.description);
        });
      } else {
        const message = errors?.description || "Registration failed.";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-36 lg:mt-60 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          className="w-full border px-3 py-2 rounded"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sending OTP..." : "Register"}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Login here
        </Link>
      </p>
    </div>
  );
}
