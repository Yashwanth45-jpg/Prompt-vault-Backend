const mongoose = require('mongoose');

function ConnectToDb() {
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("Connected to Db");
    })
    .catch(err=>{
        console.log(err);
    })
}


module.exports = ConnectToDb;