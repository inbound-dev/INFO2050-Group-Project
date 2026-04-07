import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("You must be logged in to access this page.");
      setTimeout(() => (window.location.href = "/login"), 5000);
      return;
    }

    const parsedUser: User = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      setError("You do not have admin privileges.");
      setTimeout(() => (window.location.href = "/"), 5000);
      return;
    }

    setUser(parsedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>

      {error && <p className="error">{error}</p>}

      {user && (
        <div className="info-box">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      <button type="button" className="btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}