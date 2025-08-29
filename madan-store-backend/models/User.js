// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
});

const userSchema = new mongoose.Schema({
    googleId: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, required: true, default: false },
    phone: { type: String }, // <-- ADD THIS LINE
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, {
    timestamps: true
});

// Method to compare entered password with the hashed password in the DB
userSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware that runs before a user is saved to the database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
