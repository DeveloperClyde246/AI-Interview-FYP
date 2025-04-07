import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", role: "candidate" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/admin-dashboard", {
          withCredentials: true,
        });

        const user = res.data.find((u) => u._id === id);
        if (user) {
          setForm({ name: user.name, email: user.email, role: user.role });
        } else {
          alert("User not found.");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        alert("Failed to load user from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/admin-dashboard/edit/${id}`,
        form,
        { withCredentials: true }
      );
      navigate("/admin");
    } catch (err) {
      console.error("❌ Update error:", err);
      if (err.response?.status === 400) {
        alert("Invalid input. All fields are required.");
      } else if (err.response?.status === 500) {
        alert("Server error while updating user.");
      } else {
        alert("Failed to update user.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit User</h2>

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />

        <label>Email:</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <label>Role:</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
        <br />

        <button type="submit">Save Changes</button>
      </form>

      <button onClick={() => navigate("/admin")}>← Back</button>
    </div>
  );
};

export default AdminEditUser;
