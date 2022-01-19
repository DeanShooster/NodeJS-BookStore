require('../mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const { userAuth } = require('../../middleware/authentication');
const User = require('../models/user');
const Book = require('../models/book');

const router = express.Router();


//*************************************************** GET REQUEST************************************************************************* */
/**
 * Renders the main site page.
 */
router.get('/', async (req,res) =>{
    try{
        res.render('index');
    }
    catch(e){
        res.status(500).send(e);
    }
});

/**
 * Checks if token is valid upon page load.
 */
router.get('/user/load', async(req,res)=>{
    const {token} = req.headers;
    try{
        const user = await User.findUser( token );
        if( !user )
            return res.send( {Message: 'User is not logged in.'});
        res.send( {name: user.name} );
    }
    catch(e){
        res.status(500).send(e);
    }
});

/**
 * Sends to the logged in user his own user information outside the password.
 */
router.get('/user/me',userAuth, async(req,res)=>{
    const {token} = req.headers;
    try{
        const user = await User.findUser( token );
        if( !user )
            return res.status(400).send( {Message: 'User could not be found. Please contact the management.' });
        res.send( {name: user.name, email: user.email});
    }
    catch(e){
        res.status(500).send(e);
    }
})

/**
 * Logouts user and destroys the user token.
 */
 router.get('/user/logout', async(req,res)=>{
    const {token} = req.headers;
    try{
        const user = await User.findUser( token );
        if( !user )
            return res.status(400).send( { Message: 'User not logged in. Cannot logout.'} )
        for(let i = 0; i < user.tokens.length; i++){
            if( token === user.tokens[i].token ){
                user.tokens[i].token += 'Im gonna ruin this token';
                break;
            }
        }
        await user.save();
        res.send();
    }
    catch(e){
        res.status(500).send(e);
    }
});


/**
 * Sends to the client the existing books in the user cart.
 */
router.get('/user/cart', async(req,res)=>{
    const {token} = req.headers;
    try{
        const user = await User.findUser( token );
        if( !user )
            return res.status(400).send( {Message: 'User not logged in.'} );
        await user.populate('cart.book');
        res.send( user.cart );
    }
    catch(e){
        res.status(500).send(e);
    }
});



//*************************************************** POST REQUEST************************************************************************* */

/**
 * Creates a user and adds it to the mongo DB.
 */
router.post('/user/create', async (req,res) => {
    const info = req.body;
    try{
        const user = new User(info);
        if( !user )
            return res.status(404).send({Message: 'Invalid credentials.'} );
        if( user.password.length < 6 )
            return res.status(404).send({Message: 'Invalid credentials.'} );
        await user.save();
        res.send({name: user.name});
    }
    catch(e){
        if(e.errors.email.properties.message === 'Invalid email')
            return res.status(400).send( {Message: 'Invalid credentials.'});
        res.status(500).send(e);
    }
});

/**
 * Checks if user login credentials ( email,password ) are correct and returns a token.
 */
router.post('/user/login', async (req,res)=>{
    const loginInfo = req.body;
    try{
        const user = await User.findOne( {email: loginInfo.email} );
        if( !user )
            return res.status(404).send({Message: 'Invalid credentials.'});
        const isMatch = await bcrypt.compare( loginInfo.password, user.password);
        if( !isMatch)
            return res.status(404).send({Message: 'Invalid credentials.'});
        const token = await user.generateToken();
        res.send( {token, name: user.name} );
    }
    catch(e){
        res.status(500).send(e);
    }
});


/**
 * Adds a book to the user cart list.
 */
router.post('/user/cart/add/:id',userAuth, async(req,res)=>{
    const bookName = req.params.id;
    const {token} = req.headers;
    try{
        const book = await Book.findOne( {name: bookName} );
        const user = await User.findUser( token );
        if( !user )
            return res.status(400).send({Message: 'User not logged in.'});
        await user.populate( 'cart.book' );
        for(let i = 0; i < user.cart.length; i++ )
            if( book.name === user.cart[0].book.name )
                return res.status(400).send( {Message: 'Book has been already added to the cart previously.'} );
        user.cart.push( {book} );
        await user.save();
        res.send( book );
    }
    catch(e){
        res.status(500).send(e);
    }
});

/**
 * Clears the user cart.
 */
router.post('/user/cart/buy',userAuth, async(req,res)=>{
    const {token} = req.headers;
    try{
        const user = await User.findUser( token );
        if( !user )
            return res.status(400).send({Message: 'User not logged in.'});
        if( user.cart.length === 0)
            return res.status(400).send({Message: 'Cart is empty.'});
        user.cart = [];
        await user.save();
        res.send({});
    }
    catch(e){
        res.status(500).send(e);
    }
});

//*************************************************** PATCH REQUEST************************************************************************* */

/**
 * Edits a user information.
 */
router.post('/user/me/edit',async(req,res)=>{
    try{
        const user = await User.findUser( req.body.token );
        const updateUser = req.body.user;
        if( !user )
            return res.status(400).send( { Error: 'User was not found. Please contact the management.'} );
        if( updateUser.name ){
            if( updateUser.name.length < 2 )
                return res.status(400).send({ Error: 'Name is too short.'} );
            user.name = updateUser.name;
        }
        if( updateUser.email )
            user.email = updateUser.email;
        if( updateUser.password ){
            if( updateUser.password.length < 6 )
                return res.status(400).send({ Error: 'Password is too short.'} );
            user.password = updateUser.password;
        }
        await user.save();
        res.send( {Message: 'Information has been updated.'} );
    }
    catch(e){
        res.status(500).send( {Error: 'Invalid Email.'});
    }
});

module.exports = router;