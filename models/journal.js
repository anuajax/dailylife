var mongoose = require("mongoose");

var journalSchema = mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
}, {
	timestamps: true
});

module.exports = mongoose.model("Journal", journalSchema);
