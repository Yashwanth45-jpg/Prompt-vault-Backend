const mongoose = require('mongoose');


const UserShcema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String,
        required: true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

const UserModel = mongoose.model("User", UserShcema)

module.exports = UserModel;