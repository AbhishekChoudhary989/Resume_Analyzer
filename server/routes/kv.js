const express = require('express');
const router = express.Router();
const KeyValue = require('../models/KeyValue');

// ✅ GET Endpoint: Used by Resume Page to load data
router.get('/get/:key', async (req, res) => {
    try {
        const item = await KeyValue.findOne({ key: req.params.key });
        if (!item) return res.status(404).json({ error: "Not found" });
        res.json(item.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ SET Endpoint: Used by Home Page to save analysis
router.post('/set', async (req, res) => {
    try {
        const { key, value } = req.body;
        await KeyValue.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ LIST Endpoint: Used by Home Page grid
router.post('/list', async (req, res) => {
    try {
        const all = await KeyValue.find({ key: { $regex: '^resume:' } });
        const values = all.map(doc => doc.value);
        res.json(values);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;