# Design Specification

## Project Idea
[David, Mike 11/14]

This project is an interactive multi-player on-line competitive madlib web service. The game is centered around filling in an incomplete story. The players submit words to the "card czar" who chooses which word given is used to fill in the story. The card czar is a role which changes every turn, so every player gets a chance to create the story, using their favorite submitted word given by the others.

The application presents a user friendly gui, a playing area with real-time updates, personal profile page with a fiends list, search functionality for other players profiles and an in-game chat room.  Our back end development uses MongoDB to store user data, game state and structured story data, and shares this data with the client via AJAX and Socket.IO implementations.


<br><br><br>
## Birds Eye View
[Colby 11/14]

![Flow Chart](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/dspec/images/flowchart.png "Flow Chart")

<br><br><br>
## Component-by-Component Breakdown
[Robert, Sean 11/14]

#### Overview
[Robert, Yue, Mike 11/14]

The application is built in Javascript on top of a Node.js server environment customized with the ExpressJS web framework for Node.  The server uses EJS to render static pages and initial page templates, and some of the client-side pages use dynamic reactive template updates powered by Blaze.  CSS styles based on Foundation with some customizations are used across all pages of the application for the look and feel. The website contains features from the individual aspect, such as personal profile, to the community aspect (ie. lobby and chat room). The remaining components are focused on the game aspect of the app. Certain components, like stories, are necessary for the game to run properly, while others simply enhance the players' experience.


#### Login
[Yue, Colby 11/14]

For the player login we used a library called Passport. We set it up to allow users to sign into their account by filling in two fields: Email and Password. We used HTML5 fields to deal with simple validation. Once authentication is completed, the user successfully log in and redirected to the lobby page. If authentication fails, an error message will appear, and user will be asked to re-enter information into the two fields. There is a link to the sign-up page, in case the user trying to log in does not have an account.


#### Signup
[Yue, Colby 11/14]

Passport also deals with the sign up. The account creation requires an email address, a nickname, a password and a password confirmation. The feature checks the database and makes sure the nickname has not been taken already. Once the account is created the user will be re-directed to the lobby page.


#### Lobby
[Yue, Mike 11/14]

The lobby function is is an essential feature of the web app that allows all users to see the games in progress, games being created, and games being filled up. Players not in a game will spend most of their time here.  From the lobby, players can create game rooms and invite other players to join them, and they can join existing game rooms that have slots available.


#### Story
[Sean 11/14]

All Madlib stories will be stored in a JSON object. These objects will contain information about the story like it's name, search tags, and length, as well as the story itself. The stories will be broken into "story chunks", which will provide the pieces of data that the different player views, either submitter or voter, will use inside the game. This object will be updated as the game progresses to store game state, and can be queried for any game information for rendering or other purposes.


#### Game
[Robert, Mike 11/14]

This is our main game view for when the mad-lib game is running.  Users enter this view when they join a game room from the lobby.  This page implements Blaze to render the current state of a game in real time based on data coming in from socket.io connections and ajax.  The game will support the chat features and contain likes to players profiles through their names or Gravatar.  The game views also contain the progressbar.js library for use during the game's timed turns.

**More details on the Game component are detailed below in the "In-Game Data Flow and State Transitions" section.**


#### Chat
[Yue, Colby 11/14]

Our chat is built using socket.io. Anyone participating in that particular game will be able to use the chat feature. We also set up a global variable to hold the current users nickname and gravatar and display them when a user is sending a message in chat. This feature is meant to enhance players' game experience by increasing their interaction with each other.


#### Profile
[Yue, Colby 11/14]

Profile will hold all the information about the account creator. The information shown includes a Gravatar picture, total number of games won, the players friends and a search for friends area. This feature allows players to distinguish themselves from other players and give their personal profile a unique feel. Furthermore, profiles enables players to view any other player's basic information.


#### Search
[Robert, Mike 11/14]

User search functionality is available within the profile page. This functionality allows searching for friends dynamically amongst the database of PhraseCards users.  This feature uses jQuery's AJAX functionality to fetch data from the back-end API.


#### Friends
[Robert 11/14]

Friends consists of a list of a persons friends.  It is part of the profile functionality and is used in conjunction with search.


#### API
[Mike 11/14]

The `/api/*` route space is reserved for a RESTful HTTP API that the application uses internally via AJAX to interact with the database and perform various functions.  The current API endpoints are:
```
  /api/users
    POST   : create a new user
    GET    : get a list of all users in the system

  /api/users/:user_id
    GET    : get a particular user object
    PUT    : update a user object
    DELETE : delete a user from the system by id

  /api/search/:name_string
    GET    : search for users by nickname

  /api/games
    GET    : get a list of all games / game rooms in the system
    POST   : create a new game room

  /api/games/:game_id
    GET    : get the data and state of a particular game room
    PUT    : update a particular game room object
    DELETE : delete a game room from the system

  /api/friends/:user_id
    PUT    : connect the current user and the target user as friends

  /api/friends
    GET    : get all of the current user's friends
```



<br><br><br><br>
## In-Game Data Flow and State Transitions
[Sean 11/14]


![Flow Chart](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/dspec/images/326_final_flowchart.png "Flow Chart")

[Mike 11/14]<br>
As players join a game room by navigating to the `/game/:game_id` route, their browsers will establish socket.io connections with the server.  The server will keep track of the state of each game, which it will keep synchronized to the MongoDB database.  The flow of data during a game is as follows: As each player performs an action, a socket message will be sent to the server with that action's details.  The server will decide how all the players' actions affect the game state, and emit updates to all players' browsers with the updated state.  The browser's javascript environment will then use this new state to update the HTML view via the Blaze reactive templating engine.  Certain resources needed by the browser during the game may also be requested via AJAX.

The game progresses through four phases, detailed in the above flowchart:

* Setup phase: The creator of the game room chooses a story to play with, and waits for all players to join.  Once everyone agrees to start the game, it moves to the...

* Submission phase: The game loads the first chunk (sentence or phrase) of the story and decides on a player to be "card czar", the player who will be in charge of deciding which word goes in the blank.  The czar gets to see the whole chunk, and all other players just see the type of blank (verb, noun, article of clothing, etc).  All players except the czar submit a word for the blank, which appear as cards on the board.  A time limit for these submissions counts down, after which the game progresses to the...

* Voting phase: The card czar now has to select (vote) for a particular submitted word, based on considering each of them in the context of the story chunk / phrase.  A time limit for this decision also counts down, in case the czar is unresponsive-- if this timer reaches zero, a winning card is chosen at random.  The game progresses to the...

* Review phase: All players will see the results of the submission/voting and points are awarded to the player who submitted the card chosen by the card czar.  After a certain amount of time, the game progresses to the next round, and returns to the submission phase for the next chunk of the story.

One submission -> voting -> review cycle is referred to as a "round", and there is one round for each chunk/blank in the story.  In the last round's review phase, the entire story is revealed to all players with blanks filled in with the winning words.  Players can read through it and mouse over each submitted word to see who submitted it.


<br><br><br>
## Views Walkthrough Demo
[Colby 11/12]<br/>

[View Demo Here](https://powerful-sands-7248.herokuapp.com/)

#### Log In Info
Email: demo@test.com  <br>Password: 12345<br><br>
<p>Once logged in click on the hamburger menu icon in the upper left to reveal the debugging menu that will allow you to easily jump around the views demo.</p>
![menu demo](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/dspec/images/menu.gif)


<br><br><br><br>
## Database Design
[Dan 11/13, Mike 11/14]<br/>

We are using MongoDB for our database, which will store data about each user, metadata and state of each game (both ongoing and past), and a traversable/structured/stateful form of each "mad-libs" story in the application.

#### User
```
  local          : {
    email        : String,
    password     : String,
    nickname     : String
    game_history : [game_id : String]
    contacts     : [{contact_id : String, isFriend : Boolean}]
  }
```

#### Game
[Mike/Dan 11/8]<br/>
```
  title        : String,
  active       : Boolean,  // whether or not the game is ongoing
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
```


#### Story
[Sean, Mike 11/14]

Story Schema:
```
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
```

Example Story Object (to illustrate the schema):
```json
{
  "name" : "Sample",
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

The above JSON object would represent the following "story" written out as text:
```
Sample
------

This will be the [noun] of a madlib.  This will be the text before a blank space [adjective] This will be the text following a blank space.
```

As a game progresses, its corresponding story object in the database will be mutated / populated with additional data based on the words submitted by players, which of each submission was chosen, etc.  The goal being that this story object (along with a pointer to the current "chunk" being played in a given round) can be used to keep track of the in-game progress through the story, as well as to render the full text of the story when the game is complete.
<br><br><br>

## Revision History
[Colby 11/14]<br/>

|Milestone    |Version|
|--------|:-----:|
|Project Proposal |0.1|
|Functional Spec. |0.2|
|Design Spec. |0.3|
|Views Mockup |0.4|

<br><br><br>
#### Responsibility Breakdown
[David, Mike, Colby 11/14]
<ul>
	<li>Colby Stone - Project Manager:
  	<li>Oversees the project and delegates tasks to team members. </li>
  	<li>Helps out where needed in both front and back end.</li>
  	<li>Views Mock-up/Skeleton</li>
	</li>
	<li>Sean Kelley - Creative Director:
  <li>Game and rule design</li>
  <li>Play testing</li>
  <li>Story - Content creation (writing madlibs and new feature development).</li>
</li>
<li>Robert Hromada - Documentation:
  <li>Team meeting briefings</li>
  <li>Power point presentation creator</li>
</li>
<li>David Su: Frontend Programmer:
  <li>Game mechanics</li>
  <li>Debugging</li>
</li>
<li>Yue Shing - Frontend Programmer:
  <li>Game mechanics</li>
  <li>Sign up</li>
</li>
<li>Daniel Choi - Backend Programmer:
  <li>Database setup and administration</li>
  <li>Search</li>
  <li>Profiles</li>
  <li>Login</li>
</li>
<li>Mike Turley - Backend Programmer:
  <li>Lobby</li>
  <li>Game mechanics and phase transitions</li>
  <li>Data structures / Database schema</li>
  <li>Data flow (sockets and AJAX)</li>
</li>


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
[Colby, Mike 11/8]<br/>

[jquery](http://jquery.com/)
  for some basic DOM manipulation and event handling

[Blaze](http://meteor.github.io/blaze/)
  for reactive DOM templating

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

[mongoose](http://mongoosejs.com/)
  Framework for database design

[ejs](http://www.embeddedjs.com/)
  Javascript template that cleans html code

[Gravatar](https://en.gravatar.com/)
	Display profile pictures


[Socket.io](http://socket.io/)
	Used to create Chat and Rooms
