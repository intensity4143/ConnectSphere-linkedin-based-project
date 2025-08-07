import { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { House, UserPen } from "lucide-react";

export default function Navbar() {
  const { currentUser } = useContext(userContext);

  return (
    <nav className="bg-blue-950 text-white lg:px-20 py-3 flex justify-between px-2.5 fixed top-0 left-0 w-[100%]">
      <div>
        <Link to="/home" className="font-bold text-3xl cursor-pointer">
          ConnectSphere
        </Link>
      </div>
      <div className="flex gap-4 text-lg">
        <Link
          to="/home"
          className="cursor-pointer hover:bg-black rounded-md transition px-3 py-1.5"
        >
          <House className="inline-block"/> Home
        </Link>

        <Link
          to={`/user/${currentUser && currentUser._id}`}
          className="cursor-pointer hover:bg-black rounded-md transition px-3 py-1.5"
        >
          <UserPen  className="inline-block"/> Profile
        </Link>
      </div>
    </nav>
  );
}
