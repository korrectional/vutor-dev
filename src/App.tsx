// pages
import Home from './pages/Home'
import Contact from './pages/Contact'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import Chats from './pages/Chats'
import TutorPage from './pages/TutorPage'
import './App.css'
import { store } from './services/auth'
//routing
import { BrowserRouter, Routes, Route } from 'react-router'
import ProtectedRoutes from './utils/protectedRoutes'
import AuthProvider from 'react-auth-kit';

function App() {

  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/search/tutor/:tutorID" element={<TutorPage />} />
            <Route path='/chat' element={<Chats />} />
            <Route path='/chat/:chatID' element={<Chats />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App