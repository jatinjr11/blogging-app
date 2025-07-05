const Base_url = "https://your-backend-url.onrender.com";


export default {
    Sign_in: `${Base_url}/api/users/login`,
    // http://localhost:4001/api/users/register
    Sign_up: `${Base_url}/api/users/register`,
    Get_all_blogs: `${Base_url}/api/blogs/all-blogs`,
    Get_my_profile: `${Base_url}/api/users/my-profile`,
    comments: `${Base_url}/api/comments/add`,
    admins: `${Base_url}/api/users/admins`,
    Get_all_users: `${Base_url}/api/users/all`,
    Get_single_blog: `${Base_url}/api/blogs/single-blog`,
    like: `${Base_url}/api/blogs/like`,
    blog_comments: `${Base_url}/api/blogs/comment`,
    get_single_blog_user: `${Base_url}/api/blogs/single-blog`,
    blog_reply: `${Base_url}/api/blogs/reply`,
    handle_edit_reply: `${Base_url}/api/blogs/reply/edit`,
    handle_delete_reply: `${Base_url}/api/blogs/reply/delete`,
    handle_like_comment: `${Base_url}/api/blogs/comments/like`,
    handle_edit_comment: `${Base_url}/api/blogs/comment/edit`,
    handle_delete_comment: `${Base_url}/api/blogs/comment/delete`,
    forgot_password: `${Base_url}/api/users/forgot-password`,
    google_login: `${Base_url}/api/users/google-login`,
    reset_password: `${Base_url}/api/users/reset-password`,
    verify_user: `${Base_url}/api/users/verify-user`,
    logout: `${Base_url}/api/users/logout`,
    user_comments : `${Base_url}/api/comments/add`,
    block_user: `${Base_url}/api/users`,
}