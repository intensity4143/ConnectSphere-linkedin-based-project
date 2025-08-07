import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { userContext } from "../App";
import { Plus } from "lucide-react";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const { posts, setPosts, userName } = useContext(userContext);
  const url = "http://localhost:3000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not Authorized!", {
        autoClose: 1500,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/posts/`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newPost = response.data.post
      console.log("data- " + newPost.author.name)
      setPosts((prev) => [newPost, ...prev]);
      setContent("");
    } catch (err) {
      console.error("Failed to create post", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="bg-gray-700 lg:px-5 px-2 rounded-md lg:mt-20 lg:py-4 py-2 mt-2">
        <div className="bg-white px-4 py-2 rounded-md mb-8">
      <div className=" flex justify-between">
        <div className="flex text-lg mb-2 text-white bg-violet-900 rounded-full px-3 py-1 items-center justify-center">
          
          <span className="font-semibold  cursor-pointer">{userName[0]}</span>
         
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="mb-6"
      >
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows="3"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-800 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-700"
        >
          <Plus className=" inline-block "/> Post
        </button>
      </form>
    </div>
    </div>
  );
}
