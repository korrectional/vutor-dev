import Home from './pages/Home';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Chats from './pages/Chats';
import TutorPage from './pages/TutorPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import { store } from './services/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Corrected import
import ProtectedRoutes from './utils/protectedRoutes';
import AuthProvider from 'react-auth-kit';

function App() {
  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header /> {/* Add a header for navigation */}
          <main className="flex-grow p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<Contact />} />
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/search" element={<Search />} />
                <Route path="/search/tutor/:tutorID" element={<TutorPage />} />
                <Route path="/chat" element={<Chats />} />
                <Route path="/chat/:chatID" element={<Chats />} />
              </Route>
            </Routes>
          </main>
          <Footer /> {/* Add a footer for additional links or info */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;