var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
		players : [{user_id : String, score : Number, isCardCzar : Boolean}],
		rounds  : [{cardCzar : String, winner : String, sentence : String}],
		story_id   : String
	});
