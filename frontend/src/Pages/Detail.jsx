import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { CSSTransition } from 'react-transition-group';
import './Detail.css';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';
import { ListCheckIcon } from 'lucide-react';
import { AiFillLike, AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import api from '../apis/api';

const Detail = () => {
  const { id } = useParams();
  const [blogs, setBlogs] = useState({});
  const [showFull, setShowFull] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { profile } = useAuth();
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null); // track which comment is being replied to
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [openReplyBoxId, setOpenReplyBoxId] = useState(null); // For reply textarea toggle
  const [openRepliesId, setOpenRepliesId] = useState(null);   // For showing replies


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `${api.Get_single_blog}/${id}`,
          { withCredentials: true }
        );
        setBlogs(data);
        setLikes(data.likes || []);
        setComments(data.comments || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlog();
  }, [id]);

  const getSummary = (text) => {
    if (!text) return '';
    if (text.length <= 200) return text;
    return text.substring(0, 200) + '...';
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${api.like}/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);

      const userId = profile?._id;
      if (likes.includes(userId)) {
        setLikes((prev) => prev.filter((uid) => uid !== userId));
      } else {
        setLikes((prev) => [...prev, userId]);
      }
    } catch (err) {
      toast.error('Failed to like blog');
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `${api.blog_comments}/${id}`,
        { text: newComment },
        { withCredentials: true }
      );

      // ✅ Refetch comments with proper _id and user populated
      const { data } = await axios.get(
        `${api.Get_single_blog}/${id}`,
        { withCredentials: true }
      );
      setComments(data.comments);
      setNewComment('');
      toast.success('Comment posted successfully');
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleReply = async (commentId) => {
    const text = replyTextMap[commentId];
    if (!text || !text.trim()) return;

    try {
      await axios.post(
        `${api.blog_reply}/${id}/${commentId}`,
        { text },
        { withCredentials: true }
      );
      toast.success("Reply posted!");

      const { data } = await axios.get(
        `${api.Get_single_blog}/${id}`,
        { withCredentials: true }
      );
      setBlogs(data);
      setComments(data.comments);
      setReplyTextMap((prev) => ({ ...prev, [commentId]: '' }));
      setActiveReplyId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to post reply");
    }
  };

  const handleEditReply = async (commentId, replyId) => {
    try {
      await axios.put(
        `${api.handle_edit_reply}/${id}/${commentId}/${replyId}`,
        { text: replyTextMap },
        { withCredentials: true }
      );
      toast.success("Reply updated");

      const { data } = await axios.get(
        `${api.Get_single_blog}/${id}`,
        { withCredentials: true }
      );
      setComments(data.comments);
      // setReplyText('');
      setReplyTextMap((prev) => ({
        ...prev,
        [replyId]: '',
      }));

      setActiveReplyId(null);
    } catch (err) {
      console.log(err);

      toast.error("Failed to edit reply");
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await axios.delete(
        `${api.handle_delete_reply}/${id}/${commentId}/${replyId}`,
        { withCredentials: true }
      );
      toast.success("Reply deleted");

      // Refresh comments
      const { data } = await axios.get(
        `${api.Get_single_blog}/${id}`,
        { withCredentials: true }
      );
      setComments(data.comments);
    } catch (err) {
      toast.error("Failed to delete reply");
      console.error(err);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const res = await axios.post(
        `${api.handle_like_comment}/${commentId}`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message);

      // Update state locally
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
              ...comment,
              likes: comment.likes.includes(profile._id)
                ? comment.likes.filter((id) => id !== profile._id)
                : [...comment.likes, profile._id],
            }
            : comment
        )
      );
    } catch (err) {
      toast.error("Failed to like comment");
      console.error(err);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await axios.put(
        `${api.handle_edit_comment}/${id}/${commentId}`,
        { text: editCommentText },
        { withCredentials: true }
      );
      toast.success("Comment updated");

      const { data } = await axios.get(
        `${api.Get_single_blog}/${id}`,
        { withCredentials: true }
      );
      setComments(data.comments);
      setEditCommentId(null);
      setEditCommentText('');
    } catch (err) {
      toast.error("Failed to update comment");
      console.error(err);
    }
  };

  const handleDeleteComment = async (blogId, commentId) => {
    try {
      await axios.delete(
        `${api.handle_delete_comment}/${blogId}/${commentId}`,
        { withCredentials: true }
      );
      toast.success("Comment deleted");

      const { data } = await axios.get(
        `${api.Get_single_blog}/${blogId}`,
        { withCredentials: true }
      );
      setComments(data.comments);
    } catch (err) {
      toast.error("Failed to delete comment");
      console.error(err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        {blogs && (
          <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 md:p-8 transition-transform duration-300 hover:shadow-xl hover:scale-[1.02]">

            {/* Category */}
            <div className="inline-block text-sm font-bold text-teal-700 dark:text-yellow-400 uppercase tracking-widest mb-3 border-l-4 border-teal-400 dark:border-yellow-400 pl-3">
              {blogs?.category}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-5">
              {blogs?.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center mb-6 gap-4">
              <img
                src={blogs?.adminPhoto}
                alt="Author"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <p className="text-base font-semibold text-gray-800 dark:text-white">By {blogs?.adminName}</p>
                <p className="text-xs text-gray-400">Blog Author</p>
              </div>
            </div>

            {/* Image */}
            {blogs?.blogImage && (
              <div className="relative mb-6 overflow-hidden rounded-xl shadow-md group">
                <img
                  src={blogs?.blogImage?.url}
                  alt="Blog"
                  className="w-full h-52 md:h-64 object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
                <div className="absolute bottom-3 left-3 bg-teal-600 text-white text-xs md:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                  {blogs?.category}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-300 dark:border-gray-600 my-5" />

            {/* Full or Short Content */}
            {showFull ? (
              <CSSTransition
                in={showFull}
                timeout={300}
                classNames="expand"
                unmountOnExit={false}
              >
                <div className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-medium space-y-3">
                  <p className="whitespace-pre-line">{blogs?.about}</p>
                </div>
              </CSSTransition>
            ) : (
              <div className="text-gray-700 dark:text-gray-200 text-base leading-relaxed font-medium space-y-3 mb-3">
                <p className="whitespace-pre-line">{getSummary(blogs?.about)}</p>
              </div>
            )}

            {/* Read More Toggle */}
            <div className="pt-6">
              <button
                onClick={() => setShowFull(!showFull)}
                className="inline-flex items-center gap-2 bg-teal-600 text-white py-2.5 px-7 rounded-lg text-sm font-semibold shadow-md hover:bg-teal-700 transition-all duration-300"
              >
                {showFull ? (
                  <>
                    Show Less <FiChevronUp className="text-lg" />
                  </>
                ) : (
                  <>
                    Read Full Story <FiChevronDown className="text-lg" />
                  </>
                )}
              </button>
            </div>

            {/* Likes */}
            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={handleLike}
                className="text-teal-700 dark:text-yellow-400 font-medium flex items-center gap-1 hover:text-teal-900 dark:hover:text-yellow-300"
              >
                <ListCheckIcon /> {likes.length} {likes.includes(profile?._id) ? 'Unlike' : 'Like'}
              </button>
            </div>

            {/* Comments */}
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Comments</h3>

              {/* Comment input */}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-3 rounded-md mb-3"
              />

              <button
                onClick={handleComment}
                className="bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700 transition"
              >
                Post Comment
              </button>

              {/* Comment list */}
              <div className="mt-5 space-y-4">
                {comments.length > 0 ? (
                  comments.map((c, i) => (

                    <div key={c._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-sm">
                      <p className="font-semibold text-sm text-gray-800 dark:text-white">{c.user?.name || 'User'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{c.text}</p>

                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => handleCommentLike(c._id)}
                          className={`text-sm font-medium ${c.likes?.includes(profile._id) ? 'text-teal-600' : 'text-gray-500'} hover:text-teal-700`}
                        >
                          {/* <AiTwotoneLike /> */}
                          <span className='dark:text-white text-black pr-1.5 '>  {c.likes?.length || 0} </span> {c.likes?.includes(profile._id) ? <span> <AiFillLike style={{ display: 'inline-block', width: '20px', height: '20px' }} /> Unlike</span> : <span><AiOutlineLike style={{ display: 'inline-block', width: '20px', height: '20px' }} /> Like</span>
                          }

                        </button>
                      </div>


                      {/* Reply Button */}
                      <button
                        onClick={() => setActiveReplyId(c._id === activeReplyId ? null : c._id)}
                        className="text-blue-500 text-xs mt-1"
                      >
                        Reply
                      </button>

                      {/* Reply Input */}
                      {activeReplyId === c._id && (
                        <div className="mt-2">
                          <textarea
                            value={replyTextMap[c._id] || ''}
                            onChange={(e) =>
                              setReplyTextMap({ ...replyTextMap, [c._id]: e.target.value })
                            }
                            placeholder="Write a reply..."
                            className="w-full border border-gray-300 p-2 rounded-md text-black dark:text-white dark:bg-gray-600"
                          />
                          <button
                            onClick={() => handleReply(c._id)}
                            className="mt-1 bg-teal-600 text-white px-3 py-1 rounded-md hover:bg-teal-700"
                          >
                            Post Reply
                          </button>

                        </div>
                      )}

                      {/* Show Replies */}
                      {/* Show Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <div className="ml-6 mt-3 space-y-2">
                          {c.replies.map((r, idx) => (
                            <div key={idx} className="bg-gray-200 dark:bg-gray-600 p-2 rounded-md">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                    {r.user?.name || 'User'}
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{r.text}</p>
                                </div>

                                {/* Edit/Delete for Reply Owner */}
                                {r.user?._id === profile?._id && (
                                  <div className="flex gap-2 text-xs">
                                    <button
                                      onClick={() => {
                                        setReplyTextMap(r.text);
                                        setActiveReplyId(`${c._id}-${r._id}`); // track editing
                                      }}
                                      className="text-blue-500"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReply(c._id, r._id)}
                                      className="text-red-500"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Edit Reply Input */}
                              {activeReplyId === `${c._id}-${r._id}` && (
                                <div className="mt-2">
                                  <textarea
                                    value={replyTextMap}
                                    onChange={(e) => setReplyTextMap(e.target.value)}
                                    className="w-full p-2 rounded-md border text-black"
                                  />
                                  <button
                                    onClick={() => handleEditReply(c._id, r._id)}
                                    className="mt-1 bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                                  >
                                    Save
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Edit/Delete for comment owner */}
                      {(c.user?._id === profile?._id || profile?.role === "admin") && (
                        <div className="flex gap-2 text-xs mt-1">
                          {/* Only show edit if user is comment owner */}
                          {c.user?._id === profile?._id && (
                            <button
                              onClick={() => {
                                if (editCommentId === c._id) {
                                  setEditCommentId(null); // close if already open
                                  setEditCommentText('');
                                } else {
                                  setEditCommentId(c._id); // open for edit
                                  setEditCommentText(c.text);
                                }
                              }}
                              className="text-blue-500"
                            >
                              {editCommentId === c._id ? 'Cancel' : 'Edit'}
                            </button>
                          )}

                          {/* Delete allowed for owner or admin */}
                          <button
                            onClick={() => handleDeleteComment(blogs._id, c._id)}
                            className="text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      )}


                      {/* Comment Edit Box */}
                      {editCommentId === c._id && (
                        <div className="mt-2">
                          <textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="w-full p-2 rounded-md border text-black"
                          />
                          <button
                            onClick={() => handleEditComment(c._id)}
                            className="mt-1 bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                          >
                            Save
                          </button>
                        </div>
                      )}


                    </div>

                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Detail;
