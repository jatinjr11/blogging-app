import mongoose from "mongoose";
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    blogImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true,
        minlength: [200, "About must be at least 200 characters long"]
    },
    adminName: {
        type: String,
    },
    adminPhoto: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    comments: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          text: String,
          likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
          replies: [
            {
              user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
              text: String,
              createdAt: { type: Date, default: Date.now }
            }
          ]
        }
      ]
})

export const Blog = mongoose.model("Blog", blogSchema);
export default Blog;