var mongoose = require("mongoose");

var journalSchema = new mongoose.Schema({
	title: String,
	description: String,
	created: {type: Date,default: Date.now}
});

module.exports = mongoose.model("journal", journalSchema);
