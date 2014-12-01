var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
  title        : String,
  owner        : String,
  active       : Boolean,
  minPlayers   : Number,
  maxPlayers   : Number,
  currentRound : Number,
  currentPhase : { type: String, enum: ['setup', 'wordSubmission', 'wordSelection', 'review', 'end'] },
  players : [{
    user_id    : String,
    nickname   : String,
    avatar     : String,
    status     : String,
    statusDate : Date,
    score      : Number,
    isCardCzar : Boolean
  }],
  rounds : [{           // TODO remove?
    cardCzar : String,  //
    winner   : String,  // (may not need Game.rounds)
    sentence : String   //
  }],                   //
  story_id : String,
  // adaptedStory is a mutated version of the Story schema with fields for player data.
  // this object is used to track player word submissions and render the final story.
  adaptedStory : {
    name : String,
    tags : [String],
    storyChunks: [{
      prefix : String,
      blank  : {
        wordType    : String,
        submissions : [{       // <-- not present in Story schema
          user_id : String,    // <--
          word    : String     // <--
        }],                    // <--
        winningSubmission : {  // <--
          user_id : String,    // <--
          word    : String     // <--
        }                      // <-- not present in Story schema
      },
      suffix : String
    }]
  }
});

module.exports = mongoose.model('Game', GameSchema);