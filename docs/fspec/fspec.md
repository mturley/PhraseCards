## PhraseCards
# Functional Specifications

### Name

**PhraseCards** is an online multiplayer "Mad Libs"-inspired story building game played in a web browser.

**Disclaimer**: This spec discusses what the users see and interact with while using the application, and it does not discuss underlying implementation details.  The design mockup components are included to illustrate the look and feel the authors currently envision, and are subject to change as the development process goes on and iterations are made based on user experience and practical concerns.

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
### Scenarios

1. The user will come to the home page which will display snippets of the game and a login/sign up prompt.
2. The user can sign up in which they are prompted with a window asking to provide their email address, a password, and perhaps other information.
3. The user can then login and will then be brought to the lobby.
4. The lobby page will present a list of their online friends, a button to join a random game, create a room with their friends, view their past games, or a leaderboard of the community's favorite madlibs stories.
5. Pressing the create room buttom will prompt the user to invite friends to his room and have a button to search for a game/players if the room isn't full or a button to start the game.
6. After pressing the search for game/players buttons, the room will wait while the search commences for potential joiners.
7. When the game starts the players will see a page where those present will appear in a list, a chat window, and a line for them to make their story. The Card Czar will begin at random and the game will commence.
8. The first round will consist of everyone but the Card Czar choosing a word to fit a blank of the line and the Card Czar will choose his/her favorite.
9. The Card Czar will shift to another player and the game will continue in this manner until the story is complete and is shown or perhaps will always be shown to the players.
10. After the game ends, the players will be left in the game room to chat or have the option to return to the lobby and look for a new game.
11. Users will be able to log out at any time
12. there will be profile pages where users can see their or other profiles in pop-up windows which display their recent games.
13. Viewing an old game will open the completed story and users can hover their cursor over inputted words to see whose word that was.

### Non-Goals

1. Log in through facebook.  This will link with facebook and post game events and progress
2. Write your own story.  Allows players to write their own story and submit to play with friends
3. Mobil platform development.  Allow compatibility on android and iOS platforms

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
