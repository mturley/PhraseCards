var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email:  String,
  username: String,
});