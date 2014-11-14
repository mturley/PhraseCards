# Design Specification

## Project Idea
[David 11/13]<br/>

This project is a full scale web service which centers around playing games of multiplayer madlibs. The game itself borrows from the idea of apples-to-apples where every turn a player is picked to choose submissions made by other players to fill in the blanks of premade Madlibs stories. The application presents a user friendly gui, a playing area, and an in-game chatroom.

<br><br><br>
## Birds Eye View

*** Place Flowchart here ***

<br><br><br>
## Component-by-Component Breakdown
[Robert, Sean 11/14]

#### /
<p>*** Breakdown here ***</p>

#### /lobby
<p>*** Breakdown here ***</p>

#### /story
<p>*** Breakdown here ***</p>

#### /game
<p>*** Breakdown here ***</p>

#### /chat
[Yue 11/14]
<p>The chat feature will be implemented within the game function. The chat will run only when the game in running and will end when the game is over. We will be importing and using external APIs for this feature. Anyone participating in that particular game will be able to use the chat feature. For now, we have decided not to implement a profanity filter due to time constraints. This feature is meant to enhance players' game experience by increasing their interaction with each other.</p>

#### /profile
[Yue 11/14]
<p>Profile will hold all the information about the account creator. The information shown includes a Gravator picture, account creation date, total number of games played, and recent game history. This feature allows players to distinguish themselves from other players and give their personal profile a unique feel. Furthermore, profiles enables players to view any other player's basic information. </p>

#### /signup
[Yue 11/14]
<p>The signup feature allows any person to create an account on the website. The account creation requires an email address, a username, and a password. The feature checks the database and makes sure the username has not been taken already. A validation function will also be implemented to ensure the creation of the account.</p>


<br><br><br>
## Revision History

*** Place Revision History here ***



## Views Walkthrough Demo
[Colby 11/12]<br/>

[Login Here](https://powerful-sands-7248.herokuapp.com/) Email: demo@test.com  Password: 12345
<p>Once logged in click on the hamburger menu icon in the upper left to reveal the debugging menu that will allow you to easily jump around the views demo.</p>
![menu demo](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/dspec/images/menu.gif)

<br><br><br><br>



## Database Design
[Dan 11/13]<br/>

#### User

		local	        : {
			email	    : String,
			password     : String,
			nickname     : String
			game_history : [game_id : String]
			contacts      : [{contact_id : String, isFriend : Boolean}]
		}


#### Game
[Mike/Dan 11/8]<br/>

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
[Sean, Mike 11/14]

Story Schema:
```
{
	name : String
  tags : [String],
  storyChunks : [{
    prefix: String,
  	blank: {
      type: String
      [.. additional state data about the blank will go here ..]
  	},
  	suffix: String
	}]
}
```

Example Story Object (to illustrate the schema):
```json
{
  "name" : "Sample"
  "tags" : ["Tag1", "Tag2", "Tag3"],
  "storyChunks": [
    {
      "prefix": "This will be the ",
      "blank": {
        "type": "noun"
      },
      "suffix": " of a madlib."
    },
    {
      "prefix": "This will be the text before a blank space",
      "blank": {
         "type": "adjective"
      },
      "suffix": "This will be the text following a blank space"
    },
    ...
  ]
}
```
<br><br><br>


## External Libraries
[Colby 11/8]<br/>

#### CSS

[Foundation](http://foundation.zurb.com/)
	bootstrap our css

[Font-Awesome](http://fortawesome.github.io/Font-Awesome/)
	icons

[Animate.css](http://daneden.github.io/animate.css/)
	animations


#### Javascripts
[Colby 11/8]<br/>

[jquery](http://jquery.com/)

[Foundation](http://foundation.zurb.com/)
	bootstrap our js

[progressbar.js](http://kimmobrunfeldt.github.io/progressbar.js/)
	for pretty-looking timers


##### Notable node libraries
[Mike 11/11]<br/>

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

