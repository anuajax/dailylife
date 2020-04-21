var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email:  {type: String, unique: true, required: true},
    password: String,
    phonenumber: {type:String,unique: true},
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);