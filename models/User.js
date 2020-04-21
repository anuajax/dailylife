var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email:  {type: String, unique: true, required: true},
    password: String,
    phonenumber: {type:String,unique: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date
    //jab journal model define karega to uska naam journals rakhna
    //because m journals use kar raha hu age
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);