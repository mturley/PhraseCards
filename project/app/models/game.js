var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
  title        : String,
  active       : Boolean,
  currentRound : Number,
  currentPhase : { type: String, enum: ['setup', 'wordSubmission', 'wordSelection', 'review'] },
  players : [{
    user_id    : String,
    score      : Number,
    isCardCzar : Boolean
  }],
  rounds : [{
    cardCzar : String,
    winner   : String,
    sentence : String
  }],
  story_id : String
});

module.exports = mongoose.model('Game', GameSchema);