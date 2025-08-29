import { useEffect } from "react";
import {Route, Routes} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import { useState } from "react";

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
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
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=random`
    }
    setCurrentUser(userData);
    navigate('/', {replace: true})
  }
  return (
    <Routes>
      <Route path='/login' element={<div className="fixed inset-0 bg-gradient-to-tr from-green-50 to-sky-50 flex items-center
      justify-center">
        <Login onSubmit={handleAuthSubmit}  onSwitchMode ={() => navigate('/signup')}/>
      </div>} />
      <Route path='/signup' element={<div className="fixed inset-0 bg-gradient-to-tr from-green-50 to-sky-50 flex items-center
      justify-center">
        <SignUp onSwitchMode ={() => navigate('/login')}/>
      </div>} />
    </Routes>
  )
}
export default App