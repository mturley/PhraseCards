var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var PlayerSchema = mongoose.Schema({

	local				: {
		email			: String,
		password        : String,

	}
});


// generating a hash
PlayerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
PlayerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
/*
var PlayerSchema = new Schema({
	email:  String,
	username: String,
});
*/

module.exports = mongoose.model('Player', PlayerSchema);
