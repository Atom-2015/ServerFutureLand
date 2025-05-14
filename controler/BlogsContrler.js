// Api to store the data of the blog iamge url and blog content 
//  Title	Read Time	Date	Image	Link

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