var mongoose = require('mongoose');

var StorySchema = mongoose.Schema({
  name : String,
  tags : [String],
  storyChunks: [{
    prefix : String,
    blank  : {
      wordType : String,
    },
    suffix : String
  }]
});

module.exports = mongoose.model('Story', StorySchema);