const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email:{
        type: String,
        unique: true,
        required: true,
        validate( isEmail ) { 
            if( !validator.isEmail(isEmail) )
                throw new Error('Invalid email');
        }
    },
    password:{
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
    cart: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book'
        }
    }]
});

/**
 * Encrypts password if needed before every password save or user creation.
 */
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const userPassword = await bcrypt.hash(this.password, 8);
        this.password = userPassword;
    }
    next();
});

/**
 * Generates a logging token for a user.
 * @returns String token.
 */
userSchema.methods.generateToken = async function () {
    const token = jwt.sign({ ID: this.ID }, process.env.PORT, { expiresIn: "1d" });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

/**
 * Finds the user who holds the given token.
 * @param {User token} token 
 * @returns User object or undefined
 */
userSchema.statics.findUser = async ( token ) => {
    const users = await User.find({});
    for(let i = 0; i < users.length; i++){
        for(let j = 0; j < users[i].tokens.length; j++){
            if( token === users[i].tokens[j].token )
                return users[i];
        }
    }
}

/**
 * Verifies the given token.
 * @param {User token} token 
 * @returns User ID.
 */
userSchema.statics.verifyToken = async ( token ) => {
    const decoded = jwt.verify(token, process.env.PORT);
    return decoded
}

const User = mongoose.model('Users',userSchema);
module.exports = User;