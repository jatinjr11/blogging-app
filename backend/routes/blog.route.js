import express from 'express';
import { commentOnBlog, createBlog, deleteBlog, deleteComment, deleteReply, editComment, editReply, getAllBlogs, getComments, getMyBlogs, getSingleBlogs, likeBlog, likeComment, replyToComment, updateBlog } from "../controller/blog.controller.js";
import { isAdmin, isAuthenticated, verifyUser } from '../middleware/authUser.js';

const router = express.Router();

router.post("/create", isAuthenticated, createBlog);
router.delete("/delete/:id", isAuthenticated, deleteBlog);
router.get("/all-blogs", getAllBlogs);
router.get("/single-blog/:id", isAuthenticated, getSingleBlogs);
router.get("/my-blogs", isAuthenticated, getMyBlogs);
router.put("/update/:id", isAuthenticated, updateBlog);


router.post("/like/:id", isAuthenticated, likeBlog);
router.post("/comment/:id", isAuthenticated, commentOnBlog);
// router.get("/comments/:id", getComments);
// POST /api/comments/like/:commentId
router.post('/reply/:blogId/:commentId', isAuthenticated, replyToComment);
router.put("/reply/edit/:blogId/:commentId/:replyId", isAuthenticated, editReply);
router.delete("/reply/delete/:blogId/:commentId/:replyId", isAuthenticated, deleteReply);
router.post("/comments/like/:commentId", isAuthenticated, likeComment);
router.put("/comment/edit/:blogId/:commentId", isAuthenticated, editComment);
router.delete("/comment/delete/:blogId/:commentId", isAuthenticated, deleteComment);


// `http://localhost:4001/api/blogs/reply/edit/${id}/${commentId}/${replyId}`,


export default router;