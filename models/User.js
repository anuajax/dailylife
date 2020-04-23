var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    firstname: {type: String,required: true},
    lastname: String,
    username: {type: String, unique: true, required: true},
    email:  {type: String,unique:true, required: true},
    password: String,
    phonenumber: {type:String,unique: true},
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordExpires: Date,
    // i have taken the liberty and declared journal : Jaskaran

    journals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journal"
    }]

// 3f040a5d53e4d5674a917ed458dacd340fe1c6e5
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);