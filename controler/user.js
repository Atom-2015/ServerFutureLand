const bcrypt = require("bcrypt");
const User = require("../models/user/user"); // Adjust path

module.exports.addUsers = async (req, res) => {
    try {
        const { email, password, name, company_name } = req.body;

        // Check if all required fields are provided
        if (!email || !password || !name || !company_name) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password,
            name,
            company_name,
            user_expiry_date,
            phone
        });

        // Save user to DB
        await newUser.save();

        return res.status(201).json({ message: "User created successfully", userId: newUser._id });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
