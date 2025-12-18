const router = require('express').Router();
const bcrypt = require('bcryptjs'); // For secure password comparison
const jwt = require('jsonwebtoken'); // To issue session tokens
const User = require('../models/User'); // Your MongoDB User Model

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Identity handle not recognized" });
        }

        // 2. Securely Compare Passwords
        // If you are using plain text (admin123), use: if (password !== user.password)
        // If you are using hashed passwords (recommended):
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Access Code" });
        }

        // 3. Create a Session Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'neural_secret_key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: { name: user.name, email: user.email }
        });

    } catch (err) {
        res.status(500).json({ message: "Neural Protocol Error" });
    }
});

module.exports = router;