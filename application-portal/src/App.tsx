import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Apply from './pages/Apply'
import LoginPage from './pages/Login'
import AdminPage from './pages/Admin'
import Complete from './pages/Complete'
import './App.css'

function App() {
  return (
    <Router>
      <Navigation />
      <main>
        <Routes>
          <Route path="*" element={<Navigate to="/home" replace />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/complete" element={<Complete />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App