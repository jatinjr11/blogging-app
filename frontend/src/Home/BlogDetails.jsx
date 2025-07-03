import axios from "axios";
import api from "../apis/api";

const [commentText, setCommentText] = useState("");
const [comments, setComments] = useState([]);

useEffect(() => {
  // assuming blog.comments contains populated comment objects
  setComments(blog.comments || []);
}, [blog]);

const handleCommentSubmit = async () => {
  if (!commentText.trim()) return;

  try {
    const res = await axios.post(
      `${api.user_comments}/${blog._id}`,
      { content: commentText },
      { withCredentials: true }
    );
    setComments([...comments, res.data.comment]);
    setCommentText("");
  } catch (err) {
    console.error("Comment failed", err);
  }
};

<div className="mt-4">
  <textarea
    className="w-full border rounded p-2"
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    placeholder="Write a comment..."
  />
  <button
    onClick={handleCommentSubmit}
    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
  >
    Post Comment
  </button>
</div>
