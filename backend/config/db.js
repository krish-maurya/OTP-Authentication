const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/mydatabase';

mongoose.connect(dbURI)

const db = mongoose.connection;
db.on('connected', () => {
    console.log("Database is connected");
} );
db.on('disconnected', () => {
    console.log("Database is disconnected");
});
db.on('error', (err) => {   
    console.log("Error in database connection", err);
});

module.exports = db;