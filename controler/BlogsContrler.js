// Api to store the data of the blog iamge url and blog content 
//  Title	Read Time	Date	Image	Link

const Company = require('../models/company/company')


module.exports.HandleAddBlog = async (req, res) => {
    try {
        // Extract Company ID from headers
        const companyId = req.headers["x-company-id"];
        if (!companyId) {
            return res.status(400).json({ message: "Company ID is required" });
        }

        // Validate Company ID
        const isCompanyValid = await Company.findById(companyId);
        if (!isCompanyValid) {
            return res.status(404).json({ message: "Invalid Company ID" });
        }

        // Extract Blog Data from Request Body
        const { title, readTime, date, image, link } = req.body;

        // Validate Required Fields
        if (!title || !readTime || !date || !image || !link) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new blog entry
        const newBlog = new Blog({
            companyId,
            title,
            readTime,
            date,
            image,
            link,
        });

        // Save Blog to Database
        await newBlog.save();

        return res.status(201).json({ message: "Blog created successfully", blog: newBlog });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};