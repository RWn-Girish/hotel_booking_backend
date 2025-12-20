require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const dbConnect = require('./config/dbConnection');
const app = express();
const path  =require('path');

//db Connection
dbConnect();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.static('public'));

// admin panel routes
app.use("/", require('./routes/admin/index.routes'));


app.listen(port, (err) => {
    if(err){
        console.log(`Server Error: `, err);
        return;
    }
    console.log(`Server start at http://localhost:${port}`);
})