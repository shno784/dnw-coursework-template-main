const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

// Middleware to parse request body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Setup express-session Session
app.use(session({
  secret: 'UoL DNW',
  resave: false,
  saveUninitialized: true
}))

const userRoutes = require('./routes/user');
const authorRoute = require('./routes/author');
const readerRoute = require('./routes/reader');

//set the app to use ejs for rendering
app.set('view engine', 'ejs');
//use bootstrap in css folder
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
//serve static files in the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('main-page.ejs')
});

//this adds all the userRoutes to the app under the path /user
app.use('/user', userRoutes);
app.use('/author', authorRoute);
app.use('/reader', readerRoute);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

