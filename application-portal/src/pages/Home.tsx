import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="page">
      <header className="home-header">
        <h1>Welcome!</h1>
      </header>

      <main className="home-main">
        <section className="home-portal">
          <h2>Job Application Portal</h2>
          <p>
            Welcome to our job application portal. Here, you can browse available
            positions, submit your resume, and track your application status.
            We aim to make the hiring process simple and accessible for everyone.
          </p>
          <p>
            Click below to get started and explore exciting career opportunities
            with us.
          </p>
          <a href="/apply" className="home-button">
            Apply Now
          </a>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; 2026 Conestoga College. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;