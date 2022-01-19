require('../mongoose');
const express = require('express');
const SearchFilter = require('../../utils/SearchFilter');
const { adminAuth } = require('../../middleware/authentication');
const Book = require('../models/book');

const router = express.Router();

// Book limit per a page.
const limit = 12;

//*****************************************************  GET REQUEST  ****************************************************************************/

/**
 * Sends all current existing books in the data base to the client.
 */
 router.get('/books', async(req,res)=>{
    try{
        let books;
        if( req.headers.user )
            books = await Book.find().limit(limit); // User limit DB search.
        else
            books = await Book.find(); // Admin FULL DB Search
        if( !books )
            return res.status(400).send( {Message: 'There are no books in the data base.'} );
        res.send( books );
    }
    catch(e){
        res.status(500).send(e);
    }
});

/**
 * Searches a book by given name and sends it to the client.
 */
router.get('/books/name/:id',async (req,res)=>{
    const bookSearch = req.params.id;
    try{
        if( bookSearch.length < 2)
            return res.status(400).send( {Message: 'Book name is too short.'} );
        const book = await Book.findOne( { name: bookSearch } );
        if( !book )
            return res.status(400).send( {Message:'Book not found.'} );
        res.send( book );
    }
    catch(e){
        res.status(500).send(e);
    }
});

/**
 * Searches a book by author name and sends it to the client.
 */
router.get('/books/author/:id', async (req,res)=>{
    const bookSearch = req.params.id;
    try{
        if( bookSearch.length < 2)
            return res.status(400).send( {Message: 'Book name is too short.'} );
        const book = await Book.find( { author: bookSearch } );
        if( !book || book.length === 0 )
            return res.status(400).send( {Message:'Book not found.'} );
        res.send(book);
    }
    catch(e){
        res.status(500).send(e);
    }
});

/**
 * Sends to the client all the books that starts with the request value inserted.
 */
 router.get('/books/search/:id', async(req,res)=>{
    try{
        const searchValue = req.params.id;
        const books = await Book.find();
        if( searchValue === '*' ){
            let result = [];
            for(let i = 0; i < limit && i < books.length; i++)
                result[i] = books[i];
            return res.send(result);
        }
        const result = [];
        for(let i = 0; i < books.length; i++){
            if( SearchFilter(searchValue.toLowerCase(),books[i].name.toLowerCase()) )
                result.push(books[i]);
        }
        if( !result)
            return res.status(400).send({Message: 'Invalid Search. There are no books by search value:' + searchValue});
        res.send(result);
    }
    catch(e){
        res.status(500).send(e);
    }
});

/**
 * Sends to the client the specific book page that was requested if exist.
 */
router.get('/page/:id', async(req,res)=>{
    try{
        const page = req.params.id;
        if( page < 1 || page > 1000 || isNaN(page) )
            return res.status(400).send( {Message: 'Page out of boundaries.'} );
        const result = await Book.find();
        const books = [];
        if( !result )
            return res.status(400).send( {Message: 'There are no Books in the store.'} );
        let skip = (page-1) * limit;
        for( let i = 0; skip < result.length && i < limit; skip++,i++)
            books[i] = result[skip];
        if( books.length === 0 )
            return res.status(400).send( {Message: 'Page out of boundaries.'} );
        res.send(books);
    }
    catch(e){
        res.status(500).send(e);
    }
});


//*****************************************************  POST REQUEST  ****************************************************************************/

/**
 * Adds a book to the data base.
 */
 router.post('/books/add',adminAuth,async (req,res)=>{
    try{
        const book = new Book(req.body);
        const duplicateBook = await Book.findOne( {name: book.name} );
        if( duplicateBook )
            return res.status(400).send({Message: 'Duplicate book name.'} );
        await book.save();
        res.send( {book} );
    }
    catch(e){
        res.status(500).send(e);
    }
});

//*****************************************************  PATCH REQUEST  ****************************************************************************/

/**
 * 
 */
router.patch('/books/edit/:id',adminAuth,async (req,res)=>{
    const bookName = req.params.id;
    const bookInfo = req.body;
    try{
        const book = await Book.findOne( { name: bookName } );
        if( bookInfo.name.length < 2 || bookInfo.author.length < 2 || bookInfo.year.length < 2 || bookInfo.genre.length < 2 || bookInfo.description.length < 2 )
            return res.status(400).send( {Message: 'Invalid edit. Missing fields or too short.'} );
        if( bookInfo.name != book.name )
            book.name = bookInfo.name;
        if( bookInfo.author != book.author )
            book.author = bookInfo.author;
        if( bookInfo.year != book.year )
            book.year = bookInfo.year;
        if( bookInfo.genre != book.genre )
            book.genre = bookInfo.genre;
        if( bookInfo.description != book.description )
            book.description = bookInfo.description;
        await book.save();
        res.send( book );
    }
    catch(e){
        res.status(500).send(e);
    }
});


//*****************************************************  DELETE REQUEST  ****************************************************************************/

/**
 * Removes a book from the data base.
 */
 router.delete('/books/:id',adminAuth, async (req,res)=>{
    const bookName = req.params.id;
    try{
        const deletedBook = await Book.findOneAndDelete( {name: bookName} );
        if( !deletedBook )
            return res.status(400).send( {Message: 'Book not found.'});
        res.send( {deletedBook});
    }
    catch(e){
        res.status(500).send(e);
    }
});

router.get('*',async (req,res)=>{
    try{
        res.render('404');
    }
    catch(e){
        res.status(500).send(e);
    }
});


module.exports = router;