import React from "react";

const HomePage: React.FC = () => {
  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <h1>Welcome!</h1>
      </header>

      <main style={styles.main}>
        <section style={styles.portalSection}>
          <h2 style={styles.heading}>Job Application Portal</h2>
          <p style={styles.text}>
            Welcome to our job application portal. Here, you can browse available
            positions, submit your resume, and track your application status.
            We aim to make the hiring process simple and accessible for everyone.
          </p>
          <p style={styles.text}>
            Click below to get started and explore exciting career opportunities
            with us.
          </p>
          <a  href="/apply" style={styles.button}>
            Apply Now
          </a>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2026 Conestoga College. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    margin: 0,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#666666",
    color: "white",
    textAlign: "center",
    padding: "30px 0",
  },
  main: {
    flex: 1,
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  portalSection: {
    backgroundColor: "white",
    padding: "30px",
    maxWidth: "700px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  heading: {
    color: "#2c3e50",
  },
  text: {
    color: "#555",
    lineHeight: 1.6,
  },
  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 20px",
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },
  footer: {
    backgroundColor: "#2c3e50",
    color: "white",
    textAlign: "center",
    padding: "15px 0",
  },
};

export default HomePage;