import React, { useState } from "react";

export default function Apply() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

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

      if (res.ok && data.success) {
        setError("");
        alert("Application submitted successfully!");
        window.location.href = "/complete";
      } else {
        setError(data.message || "Application failed");
      }
    } catch (error) {
      console.error("Apply error:", error);
      setError("Backend not running or request failed.");
    }
    //screwing around
    // const fileInput = document.querySelector('resume');
    //  const file = fileInput?.getAttribute('value');


    // const formData = new FormData();
    // formData.append('resume', file); // 'image' is the key your server expects

    // fetch('https://your-api.com', {
    //   method: 'POST',
    //   body: formData,
    // })
    // .then(response => response.json())
    // .then(data => console.log('Success:', data))
    // .catch(error => console.error('Error:', error));
   };

   //conventional way
  // const multer = require('multer');
  // const express = require('express');
  // const app = express();

  // const fileStorage = multer.diskStorage({
  //   destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
  //     cb(null, '.../backend/uploads/');
  //   },
  //   filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) => {
  //     cb(null, file.originalname);
  //   },
  // });

  // const upload = multer({ storage: fileStorage });

  // app.post('/upload', upload.single('resume'), (req: any, res: { json: (arg0: { success: boolean; message: string; }) => void; }) => {
  //   res.json({ success: true, message: 'File uploaded successfully' });
  // });

  return (
    <div className="page">
      <h1>Apply Now</h1>
      <p>Submit your application to our program.</p>

      {error && <p className="error">{error}</p>}

      <form action="/upload" onSubmit={handleSubmit} noValidate method="POST" encType="multipart/form-data">
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
        <input type="file" name="resume" />
        

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}