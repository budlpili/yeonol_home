const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    birthDate: { type: String, required: true },
    gender: { type: String, enum: ['M', 'F'], required: true },
    ci: { type: String, required: true, unique: true },
    di: { type: String, required: true },
    authToken: { type: String, required: true },
    authDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
