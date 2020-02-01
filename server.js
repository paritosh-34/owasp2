
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
var Sticky = require('sticky-js');


// ======================================================================


mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.set('view engine', 'njk');

// var PATH_TO_TEMPLATES = path.join(__dirname + '/templates') ;
nunjucks.configure('views', {
    express: app
});


// ======================================================================


const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    stream: String,
    datejoined: { type: Date, default: Date.now }
});

const User = mongoose.model('users', userSchema);
const user = new User({
    name: 'test1',
    password: 'test1',
    stream: 'CSE'
});


// =======================================================================


async function createUser() {
    const result = await user.save();
    console.log(result);
}

async function getUsers(res) {
    const result = await User.find();
    console.log(typeof(result));
    res.render('table.njk', {posts: result});
}


// =======================================================================


app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/dashboard'));
app.use(express.static(__dirname + '/Login_v1'));


// =======================================================================


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/dashboard/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.post('/login', (req, res) => {
    res.send(req.body);
    console.log("POST -->", req.body);
});

app.get('/api/users', (req, res) => {
    const result = getUsers(res);
});


// ========================================================================


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));