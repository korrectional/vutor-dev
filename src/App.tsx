// pages
import Home from './pages/Home'
import Contact from './pages/Contact'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Chats from './pages/Chat'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { store } from './services/auth'
import AuthProvider from 'react-auth-kit';

function App() {

  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/chat' element={<Chats />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App