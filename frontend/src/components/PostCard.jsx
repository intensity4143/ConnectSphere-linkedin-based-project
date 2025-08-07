import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  console.log(post.author)
  return (
    <div className="border rounded p-4 mb-3 bg-white shadow">
      <div className="flex justify-between">
        <div className="flex text-lg mb-2 text-white bg-violet-900 rounded-full px-3 py-1 items-center justify-center">
          <Link to={`/user/${post.author._id}`}>
            <span className="font-semibold cursor-pointer">
              {post.author?.name?.[0] || "U"}
            </span>
          </Link>
        </div>
        <div>{new Date(post.createdAt).toLocaleString()}</div>
      </div>
      <p>{post.content}</p>
    </div>
  );
}
