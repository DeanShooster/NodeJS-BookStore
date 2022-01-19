const mongoose = require('mongoose');
const db = process.env.DB_KEY;

mongoose.connect(db);