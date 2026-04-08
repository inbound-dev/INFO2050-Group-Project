import React, { useState } from "react";

export default function Apply() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("message", bio);

      if (file) formData.append("resume", file);

      const res = await fetch("http://localhost:5000/api/apply", {
        method: "POST",
        body: formData,
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { success: false, message: "Invalid server response" };
      }

      if (res.ok && data.success) {
        setError("");
        alert("Application submitted successfully!");
        window.location.href = "/complete";
      } else {
        setError(data.message || `Application failed (status ${res.status})`);
      }
    } catch (error) {
      console.error("Apply error:", error);
      setError("Request failed.");
    }
  };

  return (
    <div className="page">
      <h1>Apply Now</h1>
      <p>Submit your application to our program.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="fullName">Full Name</label>
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
          <label htmlFor="email">Email</label>
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
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>

        <p>Want to upload a resume?</p>
        <input
          type="file"
          name="resume"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}