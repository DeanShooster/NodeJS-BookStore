require('../mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const { adminAuth } = require('../../middleware/authentication');
const Admin = require('../models/admin');
const Book = require('../models/book');

const router = express.Router();

//****************************************************** GET REQUEST ********************************************************************* */

/**
 * Renders the login-admin page.
 */
router.get('/admin/login', async(req,res) =>{
    try{
        res.render('adminLogin');
    }
    catch(e){
        res.status(500).send(e);
    }
});

/**
 * Renders the main-admin page.
 */
router.get('/admin/page', async (req, res) => {
    try {
        res.render('admin');
    }
    catch (e) {
        res.status(500).send(e);
    }
});

/**
 * Verifies admin token and sends back the ID.
 */
 router.get('/admin-verify-token', adminAuth, async (req, res) => {
    try {
        const admin = await Admin.findOne({ ID: req.admin.ID });
        if (!admin)
            return res.status(404).send({ Message: 'Invalid credentials.' });
        res.send( { admin } );
    }
    catch (e) {
        res.status(500).send(e);
    }
});

/**
 * Logout admin user by removing the token from the tokens array.
 */
 router.get('/admin/logout', async(req,res)=>{
    const {token} = req.headers;
    try{
        const admin = await Admin.findOne({token});
        for(let i = 0; i < admin.tokens.length; i++){
            if( token === admin.tokens[i].token ){
                admin.tokens[i].token += 'Im gonna ruin this token';
                break;
            }
        }
        await admin.save();
        res.send();
    } 
    catch(e){
        res.status(500).send(e);
    }
});


//****************************************************** POST REQUEST ******************************************************************** */

/**
 * Admin log in request. Checks if credentials are correct and grants a token.
 */
router.post('/admin/login', async (req, res) => {
    const loginInfo = req.body;
    try {
        const admin = await Admin.findOne({ ID: loginInfo.ID });
        if (!admin)
            return res.status(404).send({ Message: 'Invalid credentials.' });
        const isMatch = await bcrypt.compare(loginInfo.password, admin.password);
        if (!isMatch)
            return res.status(404).send({ Message: 'Invalid credentials.' });
        const token = await admin.generateToken();
        res.send({ token });
    }
    catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;




// //////////////////////////////////////   Creates admin manually  /////////////////////////////////////////
//                                                          //////////////////////////////////////////////
// router.post('/create-admin', async(req,res)=>{              //////////////////////////////////////////////
//     const admin = new Admin(req.body);                      //////////////////////////////////////////////
//     admin.save();                                           //////////////////////////////////////////////
//     res.send();                                             //////////////////////////////////////////////
// });                                                   //////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////