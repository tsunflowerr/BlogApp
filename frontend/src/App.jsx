import { useEffect } from "react";
import {Outlet, Route, Routes} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx"
import Dashboard from "./pages/Dashboard.jsx";
import Trending from "./pages/Trending.jsx";
import { Navigate } from "react-router-dom";
import Following from "./pages/Following.jsx";
import Layout from "./components/layout/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import Profile from "./components/Profile.jsx";
import SimpleLayout from "./components/layout/SimpleLayout.jsx"
import PostDetail from "./pages/PostDetail.jsx";
import PostByCategory from "./pages/PostByCategory.jsx";
import PostByTag from "./pages/PostByTag.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import {jwtDecode} from "jwt-decode"

const App = () => {

   const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if(!decoded.exp) return true;
      return decoded.exp * 1000 < Date.now();
    
    }
    catch(error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (isTokenExpired(parsed.token)) {
        localStorage.removeItem("currentUser");
        return null;
      }
      return parsed;
    }
    return null;
});

  useEffect(() => {
    if(currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
    else {
      localStorage.removeItem("currentUser");
    }

  }, [currentUser]);


  const handleAuthSubmit = (data) => {
    const userData = {
      email: data.email,
      name: data.username || "User",
      avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username || "User")}&background=random`,
      token: data.token,
      _id : data._id
    }
    setCurrentUser(userData);
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    setCurrentUser(null)
    navigate('/');
  }

  return (
    <>
      <ToastContainer position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            <div className="fixed inset-0 bg-gradient-to-tr from-green-50 to-sky-50 flex items-center justify-center">
              <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate("/signup")} />
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="fixed inset-0 bg-gradient-to-tr from-green-50 to-sky-50 flex items-center justify-center">
              <SignUp onSwitchMode={() => navigate("/login")} />
            </div>
          }
        />

        {/* Layout áp dụng cho các route bình thường */}
        <Route element={<Layout user={currentUser} onLogout={handleLogout} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/category/:slug" element={<PostByCategory/>}/>
          <Route path="/tag/:slug" element={<PostByTag/>}/>
          <Route
            path="/following"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <Following />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route element={<SimpleLayout user={currentUser} onLogout={handleLogout} />}>
            <Route path="/profile/:userId" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout}/>}/>
            <Route path="/posts/:postId" element={<PostDetail user={currentUser}/>} />
            <Route path="/search" element={<SearchPage currentUser={currentUser}/>}/>
        </Route>
      </Routes>
    </>
  );
};
export default App