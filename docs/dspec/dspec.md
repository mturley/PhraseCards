# Design Specification

## Project Idea
[David 11/13]
This project is a full scale web service which centers around playing games of multiplayer madlibs. The game itself borrows from the idea of apples-to-apples where every turn a player is picked to choose submissions made by other players to fill in the blanks of premade Madlibs stories. The application presents a user friendly gui, a playing area, and an in-game chatroom.


## Views Walkthrough Demo
[Colby 11/12]
[Login Here](https://powerful-sands-7248.herokuapp.com/) Email: demo@test.com  Password: 12345
<p>Once logged in click on the hamburger menu icon in the upper left to reveal the debugging menu that will allow you to easily jump around the views demo.</p>
![menu demo](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/dspec/images/menu.gif)

<br><br><br>
## Database Design
[Dan 11/13]
#### User

		local	        : {
			email	    : String,
			password     : String,
			nickname     : String
			game_history : [game_id : String]
			contacts      : [{contact_id : String, isFriend : Boolean}]
		}


#### Game
[Mike/Dan 11/8]
		title        : String,
	  active       : Boolean,
	  currentRound : Number,
	  numPlayers   : Number,
	  currentPhase : { type: String, enum: ['setup', 'waiting', 'wordSubmission', 'wordSelection', 'review'] },
	  players : [{
	    user_id    : String,
	    score      : Number,
	    isCardCzar : Boolean,
	    status     : String,
	    statusDate : Date
	  }],
	  rounds : [{
	    cardCzar : String,
	    winner   : String,
	    sentence : String
	  }],
	  story_id : String



#### Story

		text : String (?)


<br><br><br>
## External Libraries
[Colby 11/8]
#### CSS

[Foundation](http://foundation.zurb.com/)
	bootstrap our css

[Font-Awesome](http://fortawesome.github.io/Font-Awesome/)
	icons

[Animate.css](http://daneden.github.io/animate.css/)
	animations


#### Javascripts
[Colby 11/8]
[jquery](http://jquery.com/)

[Foundation](http://foundation.zurb.com/)
	bootstrap our js

[progressbar.js](http://kimmobrunfeldt.github.io/progressbar.js/)
	for pretty-looking timers


##### Notable node libraries
[Mike 11/11]
[Express](http://expressjs.com/)
	General backend framework for our web application

[Passport](http://passportjs.org/)
	Used for user authentication (registration, login, logout)

[mongodb](http://www.mongodb.org/)
	NoSQL database

[mongoose] (http://mongoosejs.com/)
	Framework for database design

[ejs](http://www.embeddedjs.com/)
	Javascript template that cleans html code

[Gravatar](https://en.gravatar.com/)
	Display profile pictures socket.io

