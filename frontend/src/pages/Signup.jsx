import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      toast.success(`Welcome, ${res.data.user.name}! 🎉`);

      navigate("/dashboard");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Signup failed."
      );
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="auth-container">
        <ToastContainer
  position="top-right"
  autoClose={2000}
/>
      <div className="auth-card">
        <h1>🎓 Student Marketplace</h1>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

       <button
  onClick={handleSignup}
  disabled={loading}
>
  {loading ? "Creating Account..." : "Sign Up"}
</button>

        <p>
          Already have an account?
         <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;