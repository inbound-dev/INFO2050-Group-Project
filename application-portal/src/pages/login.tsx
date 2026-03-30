import React, { useState } from "react";

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { identifier, password });
    //login logic here
};


  

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Sign In
          </button>
        </form>
      </div>

      <footer style={styles.footer}>
        <p>© 2026 Conestoga College</p>
      </footer>
    </div>
  );
};
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    margin: "auto",
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    color: "#2c3e50",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "15px",
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  footer: {
    textAlign: "center",
    padding: "15px 0",
    backgroundColor: "#2c3e50",
    color: "#fff",
  },
};

export default LoginPage;