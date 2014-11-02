var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var UserSchema = mongoose.Schema({

	local				: {
		email			: String,
		password        : String,
		username		: String,
		game_history	: [{game_id : String}]
	}
});


// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
/*
var UserSchema = new Schema({
	email:  String,
	username: String,
});
*/

module.exports = mongoose.model('User', UserSchema);
