# PhraseCards
## Functional Specifications

### Name

**PhraseCards** is an online multiplayer "Mad Libs"-inspired story building game played in a web browser.

**Authors**: Daniel Choi, Robert Hromada, Sean Kelley, David Su, Yue Shing, Colby Stone, Mike Turley

This document was last updated on 10/16/2014.

### Team Organization
- Colby: Program Manager
- Sean: Creative Director
- Robert: Documentation
- Daniel: Back End Programmer
- Mike: Back End Programmer
- David: Front End Programmer
- Yue: Front End Programming

### Overview
For designing and implementing the web app, we wanted to build a simple interface that optimizes the player's experience without cluttering the webpage or screen. The interface contains the bare essentials for the game, such as player-account creation, as well as features to enhance the player's in-game experience. These features include chatrooms, custom stories, and a community leaderboard.

**Disclaimer**: This spec discusses what the users see and interact with while using the application, and it does not discuss underlying implementation details.  The design mockup components are included to illustrate the look and feel the authors currently envision, and are subject to change as the development process goes on and iterations are made based on user experience and practical concerns.

### Scenarios

1. The user will come to the home page which will display a login/sign up prompt.
2. The user can sign up in which they are prompted with a window asking to provide their name, email address, and to enter their password twice.
3. The user can then login and will be brought to the lobby.
4. The lobby page will present a list of their online friends, a button to join a random game, create a room with their friends and view their past games.
5. Using the create room buttom will prompt the user to invite friends to his room and have a button to search for a game/players if the room isn't full or a button to start the game.
6. After pressing the search for game/players buttons, the room will wait while the search commences for potential joiners.
7. When the game starts the players will see a page where those present will appear in a list, a chat window, and a line for them to make their story. The Card Czar will begin at random and the game will commence.
8. The first round will consist of everyone but the Card Czar choosing a word to fill in a blank of the line and the Card Czar will choose his/her favorite.
9. The Card Czar will shift to another player and the game will continue in this manner until the story is complete and is shown or perhaps will always be shown to the players.
10. After the game ends, the players will be left in the game room to chat or have the option to return to the lobby and look for a new game.
11. Users will be able to log out at any time, those in-game will be asked whether they're sure if they want to leave.
12. There will be profile pages where users can see their or other profiles in pop-up windows which will display their recent games and the viewer can see the user's friends list if he/she is a friend.
13. Viewing an old game will open the completed story and users can hover their cursor over inputted words to see whose word that was.
14. Users can send a friend request at any time, in which the added friend must accept the request before they're both added to each other's friend list.

### Non-Goals

1. Log in through facebook.  This will link with facebook and post game events and progress
2. Write your own story.  Allows players to write their own story and submit to play with friends
3. Mobil platform development.  Allow compatibility on android and iOS platforms
4. Profanity filter.  A system that deals with profanity in chat and in card creation
5. Karma rating.  A score associated with each player's profile that gives to negative points for quitting goals early and using banned conduct and positive points for completing games and being social.  
6. Global leader board.  A list of the top players in PhraseCards

### Flowchart

![Flow Chart](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/PhraseCards.png "Flow Chart")


### Screen-by-Screen

#### Log In
![Log In](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/login.png "Log In")

#### Sign Up
![Sign Up ](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/signup.png "Sign Up")

#### About
![About ](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/about.png "About")


#### Lobby
![Lobby ](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/lobby.png "Lobby")


#### Player View
![Player View ](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/player.png "Player View")

#### Card Czar View
![Card Czar View ](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/czar.png "Card Czar View")


#### End Game Screen
![End Game Screen ](https://github.com/umass-cs-326/team-phrase-cards/blob/master/docs/fspec/images/endgame.png "End Game Screen")
