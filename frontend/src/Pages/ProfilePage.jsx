import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import { toast } from "react-toastify";
import { userContext } from "../App";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser, setUserPosts, userPosts, currentUser, setCurrentUser } = useContext(userContext);
  const url = "https://connectsphere-backend-xjq0.onrender.com/";
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Save bio
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please Log in!", { autoClose: 1000 });
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        `${url}/api/user/updateBio`,
        { bio: bioInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Bio updated successfully!", { autoClose: 1000 });
      setUser(response.data.updated);
    } catch (error) {
      toast.error("Error while updating Bio", { autoClose: 1000 });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setBioInput(user.bio || "");
    setIsEditing(false);
  };

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login!", { autoClose: 1500 });
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${url}/api/user/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        setBioInput(response.data.user.bio || "");
      } catch (err) {
        console.error("Failed to fetch user", err.message);
        toast.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, [id]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login!", { autoClose: 1500 });
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${url}/api/posts/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserPosts(res.data.posts);
      } catch (err) {
        console.error("Failed to fetch posts", err);
        toast.error("Failed to fetch posts");
      }
    };

    fetchPosts();
  }, [id]);

  // Check if viewing own profile
  useEffect(() => {
    if (user && currentUser) {
      setIsOwnProfile(currentUser._id === user._id);
    }
  }, [user, currentUser]);


  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await axios.get("/api/user/myProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
      setCurrentUser(res.data.user);

      // Update localStorage as well (in case it's stale)
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
    } catch (error) {
      console.log("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      getUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-400 py-10 px-4 mt-10">

      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center space-y-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-violet-700 flex items-center justify-center text-white text-3xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {/* User Details */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-violet-800">{user.name}</h1>
            <p className="text-gray-600 italic mt-1">{user.bio || "No bio available."}</p>

            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 px-4 py-1.5 bg-green-800 hover:bg-green-700 text-white text-sm font-medium rounded-full transition duration-200 cursor-pointer"
              >
                <Pencil className="inline-block mr-1" size={20}/>Update Bio
              </button>
            )}
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-gray-500 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b pb-2">
            Posts by {user.name}
          </h2>
          {userPosts && userPosts.length > 0 ? (
            userPosts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <p className="text-gray-500 italic">No posts yet.</p>
          )}
        </div>
      </div>

      {/* Modal for Editing Bio */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
            <h2 className="text-lg font-semibold mb-2">Edit Your Bio</h2>
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
