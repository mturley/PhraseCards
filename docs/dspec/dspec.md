# Design Specification

## Project Idea
[David Robert 11/13]<br/>
<p>
This project is an interactive multiplayer online competitive madlib web service. The game itself borrows from the idea of apples-to-apples where every turn a player is picked to choose submissions made by other players to fill in the blanks of premade Madlibs stories. The application presents a user friendly gui, a playing area, personal profile page with a fiends list, and an in-game chatroom.  Our backend development uses dynamic server storage systems with support from jquery to the front end.</p>

<br><br><br>
## Birds Eye View

![Flow Chart](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/PhraseCards.png "Flow Chart")

<br><br><br>
## Component-by-Component Breakdown
[Robert, Sean 11/14]

#### Overview
[Robert, Yue 11/14]
<p>The website is scripted using HTML, whereas the game itself is using Javascript. Style.css is used within most of the webpages of the site, and basically contains the unique formats we implement for the webpages. In addition, all of the views of the app uses EJS.The website contains features from the individual aspect, such as personal profile, to the community aspect(ie. lobby and chatroom). The remaining components are focused on the game aspect of the app. Certain components , like stories, are necessary for the game to run properly, while others simply enhance the players' experience.</p>

#### Lobby
[Yue 11/14]
<p> The lobby function is is an essential feature of the web app that allows all users to see the games in progress, games being created, and games being filled up. Players not in a game will spend most of their time here. There will be a list of players currently in the lobby, in which a player can click and view their profiles. Moreover, in the lobby, players will be able to chat with other players in the lobby, create a game, and join a game.  </p>

#### Story
[Sean 11/14]
<p>All Madlib stories will be stored in a JSON object. These objects will contain information about the story like it's name, search tags, and length, as well as the story itself. The stories will be broken into "story chunks", which will provide the pieces of data that the different player views, either submitter or voter, will use inside the game. This object will be updated as the game progresses to store game state, and can be queried for any game information for rendering or other purposes.</p>

#### Game
[Robert 11/14]
<p>This is our main game view for when the madlib game is running.  This immplements Blaze to combine our game.ejs and game_czar_view.ejs in one reactive template.  The game will support the chat features and contain likes to players profiles through their names or Gravatar.  The game views also contain the progressbar.js library for use during the game's timed turns.  </p>

#### Chat
[Yue 11/14]
<p>The chat feature will be implemented within the game function. The chat will run only when the game in running and will end when the game is over. We used socket.io to create the chat. Anyone participating in that particular game will be able to use the chat feature. For now, we have decided not to implement a profanity filter due to time constraints. This feature is meant to enhance players' game experience by increasing their interaction with each other.</p>

#### Profile
[Yue 11/14]
<p>Profile will hold all the information about the account creator. The information shown includes a Gravator picture, account creation date, total number of games played, and recent game history. This feature allows players to distinguish themselves from other players and give their personal profile a unique feel. Furthermore, profiles enables players to view any other player's basic information. </p>

#### Signup
[Yue 11/14]
<p>The signup feature allows any person to create an account on the website. The account creation requires an email address, a username, and a password. The feature checks the database and makes sure the username has not been taken already. A validation function will also be implemented to ensure the creation of the account.</p>

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

#### Responsiblity Breakdown
- Colby Stone: Project Manager: Reponsible for final say on all aspects.  Decides what external libraries are used and in charge of their implementation and relaying information to the rest of the team.
- Sean Kelley: Creative Director: 
- Robert Hromada: Documentation: 
- David Su: Frontend Programmer: 
- Yue Shing: Frontend Programmer: 
- Daniel Choi: Backend Programmer: 
- Mike Turley: Backend Programmer: 

<br><br><br>
## Revision History
[Colby 11/14]<br/>

|Milestone    |Version|
|--------|:-----:|
|Project Proposal|0.1|
|Functional Spec.|0.2|
|Design Spec.|0.3|
|Views Mockup|0.4|

<br><br><br>
## Views Walkthrough Demo
[Colby 11/12]<br/>

[Login Here](https://powerful-sands-7248.herokuapp.com/) Email: demo@test.com  Password: 12345
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
