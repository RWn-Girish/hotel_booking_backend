require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const dbConnect = require('./config/dbConnection');
const app = express();
const path  =require('path');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('./middleware/localStrategy');
const cookieParser = require('cookie-parser');

//db Connection
dbConnect();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.static('public'));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(session({
    name: "booking-app",
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.setLocalUser);

// admin panel routes
app.use("/", require('./routes/admin/index.routes'));


app.listen(port, (err) => {
    if(err){
        console.log(`Server Error: `, err);
        return;
    }
    console.log(`Server start at http://localhost:${port}`);
})