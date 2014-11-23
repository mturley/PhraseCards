var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
  title        : String,
  active       : Boolean,
  currentRound : Number,
  maxPlayers   : Number,
  currentPhase : { type: String, enum: ['setup', 'waiting', 'wordSubmission', 'wordSelection', 'review'] },
  players : [{
    user_id    : String,
    nickname   : String,
    avatar     : String,
    status     : String,
    statusDate : Date,
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