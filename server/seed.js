// server/seed.js
const mongoose = require('mongoose');

// 1. Connect to your Database
mongoose.connect('mongodb://127.0.0.1:27017/resume-analyzer')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Connection Error:', err));

// 2. Define the Model (Must match what you used in server.js)
const TestUser = mongoose.model('TestUser', {
    name: String,
    email: String
});

// 3. The Data to Insert
const seedData = [
    { name: "Abhishek Chaudhary", email: "abhishek@example.com" },
    { name: "Rahul Sharma", email: "rahul@test.com" },
    { name: "Priya Singh", email: "priya@demo.com" }
];

// 4. Insert Logic
const seedDB = async () => {
    try {
        await TestUser.deleteMany({}); // Optional: Clears old data first
        await TestUser.insertMany(seedData);
        console.log("🌱 Data inserted successfully!");
    } catch (error) {
        console.log("❌ Error inserting data:", error);
    } finally {
        mongoose.connection.close(); // Close connection when done
    }
};

// Run it
seedDB();