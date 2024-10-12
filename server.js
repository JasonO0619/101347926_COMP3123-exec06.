const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const NoteRoutes = require('./routes/NoteRoutes')



const DB_URL = "mongodb+srv://jasonopoku:911W855HXA0jCzSH@cluster0.jae5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.Promise = global.Promise;

// TODO - Update your mongoDB Atals Url here to Connect to the database

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database mongoDB Atlas Server"); 
    
    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


app.get('/', (req, res) => {
    res.send("<h1>Welcome to Note taking application - Week06 Exercise</h1>");
});

app.use(NoteRoutes);

app.listen(8086, () => {
    console.log("Server is listening on port 8086");
});