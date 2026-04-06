import React, { useState } from "react";

export default function Apply() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone: phone,
          program: "Application Portal",
          message: bio,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Application submitted successfully!");
        window.location.href = "/complete";
      } else {
        alert(data.error || data.message || "Application failed");
      }
    } catch (error) {
      console.error("Apply error:", error);
      alert("Backend not running or request failed.");
    }
  };

  return (
    <div className="page">
      <h1>Apply Now</h1>
      <p>Submit your application to our program.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name: </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone: </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="bio">Bio: </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}