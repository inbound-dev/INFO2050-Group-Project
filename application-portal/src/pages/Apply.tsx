export default function Apply() {
  return (
    <div className="page">
      <h1>Apply Now</h1>
      <p>Submit your application to our program.</p>
      <form>
        <div>
          <label htmlFor="fullName">Full Name: </label>
          <input type="text" id="fullName" name="fullName" required />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="phone">Phone: </label>
          <input type="tel" id="phone" name="phone" />
        </div>
        <div>
          <label htmlFor="bio">Bio: </label>
          <textarea id="bio" name="bio" rows={4}></textarea>
        </div>
        <button type="submit">Submit Application</button>
      </form>
    </div>
  )
}
