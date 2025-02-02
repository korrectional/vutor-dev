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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './utils/protectedRoutes';
import AuthProvider from 'react-auth-kit';

function App() {
  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen w-full bg-gray-100">
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
