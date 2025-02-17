import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Chats from "./pages/Chats";
import TutorPage from "./pages/TutorPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignOut from "./pages/SignOut";
import Settings from "./pages/Settings";
import File from "./pages/File";
import "./App.css";
import { store } from "./services/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./utils/protectedRoutes";
import AuthProvider from "react-auth-kit";

function App() {
    return (
        <AuthProvider store={store}>
            <BrowserRouter>
                <div className="flex flex-col min-h-screen w-full bg-gray-200 text-gray-900">
                    <Header />
                    <main className="flex-1 w-full container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route element={<ProtectedRoutes />}>
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />
                                <Route path="/signout" element={<SignOut />} />
                                <Route path="/search" element={<Search />} />
                                <Route
                                    path="/search/tutor/:tutorID"
                                    element={<TutorPage />}
                                />
                                <Route path="/chat" element={<Chats />} />
                                <Route
                                    path="/chat/:chatID"
                                    element={<Chats />}
                                />
                                <Route
                                    path="/settings"
                                    element={<Settings />}
                                />
                                <Route
                                    path="/uploads/:filename"
                                    element={
                                        <div className="fixed inset-0 bg-black text-white flex justify-center items-center">
                                            <File />
                                        </div>
                                    }
                                />
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
