// server/models/KeyValue.js
const mongoose = require('mongoose');

const KeyValueSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    // ✅ FIX: Use 'Mixed' type to allow storing JSON objects directly
    value: { type: mongoose.Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('KeyValue', KeyValueSchema);