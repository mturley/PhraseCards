# Design Specification

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
