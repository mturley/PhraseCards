var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  email:  String,
  username: String,
});