const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
});

/**
 * Encrypts password if needed before every save.
 */
adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const adminPassword = await bcrypt.hash(this.password, 8);
        this.password = adminPassword;
    }
    next();
});

/**
 * Generates a log in token [ 15 minutes ] for admin.
 * @returns String token.
 */
adminSchema.methods.generateToken = async function () {
    const token = jwt.sign({ ID: this.ID }, process.env.PORT, { expiresIn: "1d" });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

/**
 * Verifies the given token.
 * @param {Admin token} token 
 * @returns Admin ID
 */
adminSchema.statics.verifyToken = async ( token ) => {
    const decoded = jwt.verify(token, process.env.PORT);
    return decoded
}

const Admin = mongoose.model('Admins', adminSchema);
module.exports = Admin;