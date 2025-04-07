import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/auth/register", formData, {
        withCredentials: true,
      });
      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 1500); // Redirect to login after short delay
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email already in use.");
      } else if (err.response?.status === 400) {
        setError("Invalid email format.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={{ ...styles.error, color: "green" }}>{success}</p>}

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={{ fontSize: "14px", marginTop: "10px", color: "#000000" }}>
          Already have an account?{" "}
          <Link to="/login" style={styles.forgotPassword}>
            Login
          </Link>
        </p>
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
    padding: "8px 88px",
    backgroundColor: "#38bdf8",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    alignSelf: "center",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
};

export default Register;
