import './App.css'
import Home from './pages/Home'
import Contact from './pages/Contact'
import { BrowserRouter, Route, Router, Routes } from 'react-router'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
