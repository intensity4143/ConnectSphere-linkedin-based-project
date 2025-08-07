import { useContext, useEffect } from "react";
import axios from "axios";
import CreatePost from "../components/CreatePost";
import { userContext } from "../App";
import Sidebar from "../components/SideBar";
import PostCard from "../components/PostCard";
import { useNavigate } from "react-router-dom";
import { Newspaper } from "lucide-react";

export default function HomePage() {
  const {
    setUserName,
    setUserEmail,
    posts,
    setPosts,
    setUser,
    setCurrentUser,
  } = useContext(userContext);

  const url = "http://localhost:3000";
  const navigate = useNavigate();

  // get user details
  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log In!");
        navigate("/login");
        return;
      }

      const response = await axios.get(url + "/api/user/myProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
        setCurrentUser(response.data.user);
        setUserName(response.data.user.name);
        setUserEmail(response.data.user.email);
      }
    } catch (error) {
      console.log("Error fetching user", error);
    }
  };

  // get all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(url + "/api/posts/");
      const allPosts = res.data.posts;
      setPosts(allPosts);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    getUserDetails();
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row bg-gray-400 justify-center ">
      {/* Sidebar */}
      <div className=" lg:p-4 lg:flex-1/5 flex justify-center ">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className=" p-4 lg:px-10 md:px-6 flex-1/2 flex justify-center flex-col bg-gray-500">
        <CreatePost />
        <div className="flex bg-gray-800 text-white rounded-md px-2 py-0.5 w-40 my-2 ">
          <h2 className="text-xl font-bold my-4">
            <Newspaper className="inline-block" /> Your Feed
          </h2>
        </div>

        {posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
      <div className="lg:block hidden w-50"></div>
    </div>
  );
}
