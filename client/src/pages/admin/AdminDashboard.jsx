import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin/AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin-dashboard", { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      alert("Failed to load users. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/admin-dashboard/create", form, {
        withCredentials: true,
      });
      setForm({ name: "", email: "", password: "", role: "candidate" });
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Email already exists.");
      } else if (err.response?.status === 400) {
        alert("Invalid email format or missing field.");
      } else {
        alert("Server error while creating user.");
        console.error("❌ Create error:", err);
      }
    }
  };

  const deleteUser = async (id) => {
    const confirm = window.confirm("Are you sure?");
    if (!confirm) return;

    try {
      await axios.post(`http://localhost:5000/admin-dashboard/delete/${id}`, {}, {
        withCredentials: true,
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      if (err.response?.status === 403) {
        alert("You cannot delete the main admin account.");
      } else {
        alert("Failed to delete user.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/logout", { withCredentials: true });
      if (res.status === 200) {
        navigate("/login");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error during logout:", err);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <section className="create-user">
        <h3>Create New User</h3>
        <form onSubmit={createUser}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Create</button>
        </form>
      </section>

      <section className="user-list">
        <h3>All Users</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => navigate(`/admin-dashboard/edit/${u._id}`)}>Edit</button>
                  <button onClick={() => navigate(`/admin-dashboard/change-password/${u._id}`)}>Change Password</button>
                  <button onClick={() => deleteUser(u._id)} className="danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default AdminDashboard;
