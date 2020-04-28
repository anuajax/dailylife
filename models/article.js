var mongoose = require("mongoose");

var articleSchema =new mongoose.Schema({
    title: String,
    image: String,
    text:String,
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
    },
    comment:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
},{
    timestamps: true
});

module.exports = mongoose.model("Article",articleSchema);