var mongoose = require("mongoose");

var articleSchema =new mongoose.Schema({
    title: String,
    image: String,
    text:String,
    // comments:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Comment"
    // }],
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
},{
    timestamps: true
});

module.exports = mongoose.model("Article",articleSchema);