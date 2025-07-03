import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";
export const createBlog = async (req, res) => {
    try {

        if (req.user.isBlocked) {
            return res.status(403).json({ message: "You are blocked by admin" });
        }

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "Blog Image is Required" });
        }

        const { blogImage } = req.files;
        const allowedFormets = ["image/png", "image/jpeg", "image/webp"];
        if (!allowedFormets.includes(blogImage.mimetype)) {
            return res.status(400).json({ message: "Please upload a valid image file" });
        }

        const { title, category, about } = req.body;
        if (!title || !category || !about) {
            return res.status(400).json({ message: "title, category and about is required" });
        }

        const adminName = req?.user?.name;
        const adminPhoto = req?.user?.photo?.url;
        const createdBy = req?.user?._id;
        console.log(adminName, adminPhoto, createdBy);

        const cloudinaryResponse = await cloudinary.uploader.upload(
            blogImage.tempFilePath
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error);
        }

        const blogData = {
            title,
            about,
            category,
            adminName,
            adminPhoto,
            createdBy,
            blogImage: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.url
            },
        };
        const blog = await Blog.create(blogData);
        res.status(201).json({
            message: "Blog created successfully",
            blog,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error creating user", error });
    }
};

export const deleteBlog = async (req, res) => {
    console.log("ID: " + req.params.id);
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    // 👇 Check if logged-in user is the creator of the blog
    if (blog.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
}

export const getAllBlogs = async (req, res) => {
    try {
        const allBlogs = await Blog.find({})
            .populate("comments") // Make sure 'comments' is in Blog model
            .populate("createdBy", "name");

        res.status(200).json(allBlogs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error getting all blogs" });
    }
}


export const getSingleBlogs = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Invalid Blog Id" });
        }

        const blog = await Blog.findById(id)
            .populate({
                path: "comments",
                populate: [
                    { path: "user", select: "name photo" },
                    {
                        path: "replies.user", // 👈 populate reply users
                        model: "User",
                        select: "name photo"
                    }
                ]
            });

        res.status(200).json(blog);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error getting single blog" });
    }
};


export const getMyBlogs = async (req, res) => {
    try {
        const createdBy = req.user._id;
        console.log("Current logged-in user ID:", createdBy); // debug
        console.log("Req.user.id", req.user._id);
        console.log("req.body", req.body);

        const myBlogs = await Blog.find({ createdBy });
        res.status(200).json(myBlogs);
    } catch (error) {
        return res.status(500).json({ message: "Error getting my blogs" });
    }
}

export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // 👇 Check if logged-in user is the creator of the blog
        if (blog.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this blog" });
        }

        // Check if new image is provided
        let blogImageData = blog.blogImage; // existing image data
        if (req.files && req.files.blogImage) {
            const { blogImage } = req.files;
            const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

            if (!allowedFormats.includes(blogImage.mimetype)) {
                return res.status(400).json({ message: "Please upload a valid image file" });
            }

            // Optionally: delete old image from cloudinary here if needed

            const cloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath);
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.log(cloudinaryResponse.error);
                return res.status(500).json({ message: "Error uploading image" });
            }

            blogImageData = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.url
            };
        }

        const { title, category, about } = req.body;

        if (!title || !category || !about) {
            return res.status(400).json({ message: "title, category and about are required" });
        }

        // Update blog fields
        blog.title = title;
        blog.category = category;
        blog.about = about;
        blog.blogImage = blogImageData;

        // If you want to update admin info, can be done here, but usually it stays same on update

        await blog.save();

        res.status(200).json({
            message: "Blog updated successfully",
            blog,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating blog", error });
    }
};

export const likeBlog = async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    const userId = req.user._id;

    if (!blog.likes.includes(userId)) {
        blog.likes.push(userId);
        await blog.save();
        return res.json({ message: "Liked!" });
    } else {
        blog.likes.pull(userId);
        await blog.save();
        return res.json({ message: "Unliked!" });
    }
};

export const commentOnBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const comment = {
            user: req.user._id,
            text: req.body.text,
        };

        blog.comments.push(comment);
        await blog.save();

        // Refetch the blog with populated user in comments
        const updatedBlog = await Blog.findById(req.params.id)
            .populate({
                path: "comments.user",
                select: "name photo"
            });

        const newComment =
            updatedBlog.comments[updatedBlog.comments.length - 1];

        res.status(201).json({ message: "Comment added!", comment: newComment });
    } catch (error) {
        console.error("commentOnBlog error:", error.message);
        res.status(500).json({ message: "Error adding comment" });
    }
};


export const getComments = async (req, res) => {
    const blogId = req.params.id;
    const comments = await Comment.find({ blog: blogId }).populate("user", "name");

    console.log("comments: ", comments);

    res.status(200).json({ comments }); // ✅ correct response
};

// Comment model has: text, user, likes (Array of ObjectIds)
// export const likeComment = async (req, res) => {
//     try {
//         const { commentId } = req.params;
//         const userId = req.user._id;

//         const blog = await Blog.findOne({ 'comments._id': commentId });

//         console.log("blog: ", blog);


//         if (!blog) return res.status(404).json({ message: 'Blog or comment not found' });

//         const comment = blog.comments.id(commentId);
//         console.log("Commment: ", comment);

//         if (!comment) return res.status(404).json({ message: 'Comment not found' });

//         const alreadyLiked = comment.likes.includes(userId);

//         if (alreadyLiked) {
//             comment.likes.pull(userId);
//         } else {
//             comment.likes.push(userId);
//         }

//         await blog.save();
//         res.status(200).json({ message: alreadyLiked ? 'Comment unliked' : 'Comment liked' });
//     } catch (error) {
//         console.error('Like comment error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

export const replyToComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const { text } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const comment = blog.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        comment.replies.push({ user: req.user._id, text });
        await blog.save();

        return res.status(200).json({ message: "Reply added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error replying to comment" });
    }
};

export const editReply = async (req, res) => {
    const { blogId, commentId, replyId } = req.params;
    const { text } = req.body;
    try {
        const blog = await Blog.findById(blogId);
        const comment = blog.comments.id(commentId);
        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        if (reply.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        reply.text = text;
        await blog.save();
        res.status(200).json({ message: "Reply updated" });
    } catch (err) {
        res.status(500).json({ message: "Error editing reply" });
    }
};

export const deleteReply = async (req, res) => {
    try {
        const { blogId, commentId, replyId } = req.params;

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const comment = blog.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Filter out the reply to delete
        comment.replies = comment.replies.filter(
            (reply) => reply._id.toString() !== replyId
        );

        await blog.save();

        return res.status(200).json({ message: "Reply deleted successfully" });
    } catch (error) {
        console.error("Delete Reply Error:", error);
        res.status(500).json({ message: "Error deleting reply" });
    }
};


export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const blog = await Blog.findOne({ "comments._id": commentId });

        if (!blog) return res.status(404).json({ message: "Comment not found" });

        const comment = blog.comments.id(commentId);

        const userId = req.user._id;
        const index = comment.likes.indexOf(userId);

        if (index > -1) {
            comment.likes.splice(index, 1); // unlike
            await blog.save();
            return res.status(200).json({ message: "Comment unliked" });
        } else {
            comment.likes.push(userId); // like
            await blog.save();
            return res.status(200).json({ message: "Comment liked" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to like comment" });
    }
};

// PUT /api/blogs/comment/edit/:blogId/:commentId
export const editComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const { text } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const comment = blog.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to edit this comment" });
        }

        comment.text = text;
        await blog.save();

        res.status(200).json({ message: "Comment updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update comment" });
    }
};

// DELETE /api/blogs/comment/delete/:blogId/:commentId
export const deleteComment = async (req, res) => {
    const { blogId, commentId } = req.params;
  
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
  
    const comment = blog.comments.find(
      (c) => c._id.toString() === commentId
    );
  
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
  
    // Only comment owner or admin can delete
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
  
    // ❌ comment.remove();  // this won't work
    // ✅ Use filter
    blog.comments = blog.comments.filter(
      (c) => c._id.toString() !== commentId
    );
  
    await blog.save();
  
    res.status(200).json({ message: "Comment deleted successfully" });
  };
  