const mongoose = require('mongoose');


const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB is Connected'))
    .catch(err => console.log(err));
}

module.exports = dbConnect;