import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from './Pages/signUp';
import Login from './Pages/Login';
import HomePage from './Pages/HomePage';
import ProtectedRoute from './ProtectedRoute';
import { useState, createContext } from "react";
import ProfilePage from "./Pages/ProfilePage";
import Layout from "./Layout";
import Notifications from "./Pages/Notifications";
import Messages from "./Pages/Messages";
import Jobs from "./Pages/Jobs";

const userContext = createContext();

function App() {
  const [userName, setUserName] = useState("user");
  const [userEmail, setUserEmail] = useState("user@gmail.com");
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [userPosts, setUserPosts] = useState([])

  return (
    <userContext.Provider value ={{
      userName,
      setUserName,
      userEmail,
      setUserEmail,
      posts,
      setPosts,
      user,
      setUser,
      currentUser,
      setCurrentUser,
      userPosts,
      setUserPosts
    }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<HomePage />} />
          <Route path="/user/:id" element={<ProfilePage />} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/messages" element={<Messages/>} />
          <Route path="/jobs" element={<Jobs/>} />
        </Route>
      </Routes>
    </userContext.Provider>
  );
}

export default App;
export { userContext };
