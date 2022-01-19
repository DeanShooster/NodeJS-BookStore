const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        minlength: 2
    },
    author: {
        type: String,
        require: true,
        trim: true,
        minlength: 2
    },
    year: {
        type: Number,
        require: true
    },
    genre: {
        type: String,
        required: true
    },
    description: { 
        type: String,
        require: true
    },
    image:{
        type: String,
        required: true
    }
});


const Book = mongoose.model('Book',bookSchema);
module.exports = Book;
