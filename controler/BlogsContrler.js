// const Blog = require('../models/Blogs/blogs')
const Blog = require('../models/Blogs/blogs')


module.exports.HandleAddBlog = async (req, res) => {
    try {
        const { title, date, image, url } = req.body;

        if (![title, date, image, url].every(Boolean)) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newBlog = new Blog({ title, date, image, url });

        await newBlog.save();

        return res.status(201).json({ message: "Blog created successfully", blog: newBlog });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// Get api for getting all blogs
module.exports.HandleGetAllBlogs = async (req, res) => {
    try {
        // Fetch all blogs, newest first
        const blogs = await Blog.find();
        // console.log(blogs)
        return res.status(200).json({
            message: 'Blogs fetched successfully',
            blogs,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};



// Delete API for blogs
module.exports.HandleDeleteBlog = async (req, res) => {
    try {
        // console.log(req.params)
        const blogId = req.headers['x-blog-id']
        if (!blogId) {
            return res.status(400).json({ message: "Blog id is required" });
        }
        // const id = req.params.id;
        const blog = await Blog.findByIdAndDelete(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({ message: "Blog deleted successfully",blog });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// api to update the blog data
module.exports.HandleUpdateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, image, url } = req.body;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({ message: "Blog ID is required" });
        }

        // Find and update blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, date, image, url },
            { new: true, runValidators: true }
        );

        // Blog not found
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
