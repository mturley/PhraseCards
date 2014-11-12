// lobby.js
// Frontend UI code for the /lobby page only

"use strict";

var LobbyData = {
  activeGames: new Blaze.Var([]),
  reloadGames: function() {
    $.ajax({
      type : 'GET',
      url  : '/api/games'
    }).done(function(data) {
      LobbyData.activeGames.set(data);
    }).fail(function() {
      console.log("AJAX FAILURE", arguments);
      alert("GET /api/games failed!  TODO: properly Foundation-styled error alert.");
    });
  }
};

Template.lobbyPanels.activeGames = function() {
  return LobbyData.activeGames.get();
};

LobbyData.reloadGames();


// When the DOM is ready, render templates
$(function() {

  /*
    For this page, we're using a reactive templating system called Blaze: http://meteor.github.io/blaze/
    Blaze takes over the entire page by default, but the below code overrides that behavior to only use
    Blaze on certain elements of the page.  This approach is based on the discussion found here:
    https://groups.google.com/forum/#!topic/blazejs/64y_JqzgcIg
  */
  if (Template.lobbyPanels) {
    var parentNode = $("#lobby_panels_parent").get(0);
    var nextNode = $("#new_game_panel").get(0);
    UI.insert(UI.render(Template.lobbyPanels), parentNode, nextNode);
  }

  // Reload the list of games every 5 seconds.
  // TODO instead, reload this when the underlying data changes by using sockets?
  setInterval(LobbyData.reloadGames, 5000);

});