import { useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await API.post("/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    toast.success(`Welcome back, ${res.data.user.name}!`);

    navigate("/dashboard");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Login failed"
    );
  }
};

  return (
  <div className="auth-container">
    <div className="auth-card">

      <img
        src="/logo.png"
        alt="CampusCart"
        className="login-logo"
      />

      <h1>Welcome Back 👋</h1>

      <p className="tagline">
        Buy. Sell. Connect.
      </p>

      <p className="subtitle">
        Sign in to continue buying and selling on CampusCart.
      </p>

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <p className="signup-text">
        Don't have an account?{" "}
        <Link to="/signup">
          Create one
        </Link>
      </p>

    </div>
  </div>
);
}

export default Login;