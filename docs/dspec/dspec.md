# Design Specification

## Project Idea

This project is a web application that provides a game of multipler Madlibs. The game is centered around filling in an incomplete story. The players submit words to the "card czar" who chooses which word given is used to fill in the story. The card czar is a role which changes every turn, so every player gets a chance to create the story, using their favorite submitted word given by the others.
 

## Views Walkthrough Demo

[Login Here](https://powerful-sands-7248.herokuapp.com/) Email: demo@test.com  Password: 12345
<p>Once logged in click on the hamburger menu icon in the upper left to reveal the debugging menu that will allow you to easily jump around the views demo.</p>
![menu demo](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/dspec/images/menu.gif)

<br><br><br>
## Database Design

#### User

		local	        : {
			email	    : String,
			password     : String,
			username     : String
			game_history : [game_id : String]
		}


#### Game

		players : [{user_id : String, score : Number, isCardCzar : boolean}],
		rounds  : [{cardCzar : String, winner : String, sentence : String}],
		story   : [???]



#### Story

		text : [???]


<br><br><br>
## External Libraries

#### CSS

	Foundation
		bootstrap our css

	Font-Awesome
		icons

	Animate.css
		animations


#### Javascripts

	jquery

	fastclick
		reduce click responce lag on mobile devices

	Foundation
		bootstrap our js

	progressbar.js (http://kimmobrunfeldt.github.io/progressbar.js/)
		for pretty-looking timers
	
	Notable node libraries 
	
	express General backend framework for our web application
	
	passport Used for user authentication (registration, login, logout) 

	mongodb/mongoose NoSQL database and the framework for database design 

	ejs Javascript template that cleans html code 

	gravatar Display profile pictures socket.io
