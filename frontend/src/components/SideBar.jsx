import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LogOut, UserPen, BellRing, Mail, Handbag  } from "lucide-react";


export default function Sidebar() {
  const { userName, userEmail, currentUser} = useContext(userContext);
  const navigate = useNavigate();

  // handle logout
  const handleLogout = () => {
    toast.success("Logged Out!");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="lg:w-64 lg:py-10 bg-white px-6 flex lg:flex-col rounded-xl items-center shadow-md shadow-gray-700 border border-gray-200  flex-row mt-20 w-full mx-3 py-2 lg:h-150 lg:fixed mb-4">
        
      <div className="flex flex-col">
        {/* Profile Avatar */}
      <div className="mb-4">
        <div className="w-36 h-36 rounded-full bg-purple-900 flex items-center justify-center text-white text-6xl font-bold shadow-inner">
          {userName[0]}
        </div>
      </div>

      {/* User Info */}
      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-gray-800">{userName}</p>
        <p className="text-sm text-gray-600">{userEmail}</p>
      </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex lg:flex-col flex-row flex-wrap lg:gap-4 gap-2">
        <Link
          to={`/user/${currentUser && currentUser._id}`}
          className="flex items-center gap-2 px-4 py-2 rounded-md  transition hover:bg-black hover:text-white"
        >
          <span className="text-lg"><UserPen/></span>
          <span className=""> My Profile</span>
        </Link>

        <Link
          to="/notifications"
          className="flex items-center gap-2 px-4 py-2 rounded-md transition hover:bg-black hover:text-white"
        >
          <span className="text-lg"><BellRing /></span>
          <span className="">Notifications</span>
        </Link>

        <Link
          to="/messages"
          className="flex items-center gap-2 px-4 py-2 rounded-md transition hover:bg-black hover:text-white"
        >
          <span className="text-lg"><Mail/></span>
          <span className="">Messages</span>
        </Link>

        <Link
          to="/jobs"
          className="flex items-center gap-2 px-4 py-2 rounded-md transition hover:bg-black hover:text-white"
        >
          <span className="text-lg"><Handbag/></span>
          <span className="">Jobs</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-md transition  hover:bg-black hover:text-white">
          <LogOut className="text-red-800 inline text-center size-4.5 text-sm" />
          &nbsp; Log Out
        </button>
      </nav>
    </div>
  );
}
