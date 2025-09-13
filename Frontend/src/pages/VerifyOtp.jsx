import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const otpToken = localStorage.getItem("otp_session");
    if (token) {
      navigate("/");
    }
    if (!otpToken) {
      navigate("/register");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is missing. Please register again.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/verify-otp`,
        { email, otp }
      );
      toast.success("OTP verified. Registration complete!");
      localStorage.removeItem('otp_session');
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.description || "Invalid OTP. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-40 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="otp"
          placeholder="Enter OTP"
          className="w-full border px-3 py-2 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}
