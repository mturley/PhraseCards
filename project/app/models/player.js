var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
	email:  String,
	username: String,
});

module.exports = mongoose.model('Player', PlayerSchema);
