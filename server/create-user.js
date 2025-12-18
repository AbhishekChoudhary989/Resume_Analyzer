// server/create-user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Make sure you have this installed (npm install bcryptjs)
require('dotenv').config();

// 1. Define the Real User Schema (Must match your models/User.js)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String }
    // Add other fields if your specific User.js model requires them
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resume-analyzer');
        console.log("✅ Connected to Database");

        // 2. The User Details
        const email = "abhishek@example.com";
        const rawPassword = "password123"; // This is what you will type in the login screen

        // 3. Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        // 4. Create User
        // First, check if user exists to avoid duplicates
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ User already exists. Updating password...");
            existingUser.password = hashedPassword;
            await existingUser.save();
        } else {
            const newUser = new User({
                email: email,
                password: hashedPassword,
                name: "Abhishek Admin"
            });
            await newUser.save();
            console.log("🎉 New User Created!");
        }

        console.log("------------------------------------------------");
        console.log("👉 Login Email:    " + email);
        console.log("👉 Login Password: " + rawPassword);
        console.log("------------------------------------------------");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        mongoose.disconnect();
    }
};

createAdmin();