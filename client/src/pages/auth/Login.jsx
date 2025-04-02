import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { data } = await axios.get("http://localhost:5000/auth/me", {
        withCredentials: true,
      });

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "recruiter") navigate("/recruiter");
      else navigate("/candidate");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="User Avatar"
          style={styles.avatar}
        />
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            style={styles.input}
          />
          {/* <Link to="/forgot-password" style={styles.forgotPassword}>
            Forgot password? Click here.
          </Link> */}
          <button type="submit" style={styles.button}>
            Log in
          </button>
          <p style={{ fontSize: "14px", marginTop: "10px",color: "#000000" }}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#A5F3B0",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  title: {
    marginBottom: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#000000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  forgotPassword: {
    fontSize: "12px",
    color: "#007bff",
    textDecoration: "none",
    marginBottom: "10px",
  },
  button: {
    padding: "8px 88px", // 👈 smaller horizontal padding
    backgroundColor: "#38bdf8",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    alignSelf: "center", // 👈 center in form
  },
  secondaryButton: {
    padding: "8px 80px", // 👈 match login button size
    backgroundColor: "#fff",
    border: "1px solid #38bdf8",
    borderRadius: "5px",
    color: "#38bdf8",
    cursor: "pointer",
    fontWeight: "bold",
    alignSelf: "center", // 👈 center in form
    marginTop: "5px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default Login;
