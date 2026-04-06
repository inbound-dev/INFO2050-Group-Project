import React from "react";

const AdminPage: React.FC = () => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.text}>Welcome to the admin page.</p>

        {parsedUser && (
          <div style={styles.infoBox}>
            <p><strong>Name:</strong> {parsedUser.name}</p>
            <p><strong>Email:</strong> {parsedUser.email}</p>
            <p><strong>Role:</strong> {parsedUser.role}</p>
          </div>
        )}

        <button
          style={styles.button}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#2c3e50",
  },
  text: {
    marginBottom: "20px",
    fontSize: "16px",
  },
  infoBox: {
    backgroundColor: "#eef3f8",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "left",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default AdminPage;