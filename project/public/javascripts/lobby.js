// lobby.js
// Frontend UI code for the /lobby page only

(function() {
  
  "use strict";

  var LobbyUI = {
    activeGames: new Blaze.Var([]),
    reloadGames: function() {
      $.ajax({
        type : 'GET',
        url  : '/api/games'
      }).done(function(data) {
        LobbyUI.activeGames.set(data);
      }).fail(function() {
        console.log("AJAX FAILURE", arguments);
        alert("GET /api/games failed!  TODO: properly Foundation-styled error alert.");
      });
    },
    createAndJoinGame: function(withTitle) {
      $.ajax({
        type : 'POST',
        url  : '/api/games',
        data : { title : withTitle },
      }).done(function(data) {
        if(data.success) {
          document.location = '/game/'+data.game_id;
        } else {
          alert(data.message); // TODO properly Foundation-styled message alert
        }
      }).fail(function() {
        console.log("AJAX FAILURE", arguments);
        alert("POST /api/games failed!  TODO: properly Foundation-styled error alert.");
      });
    }
  };

  Template.lobbyPanels.activeGames = function() {
    return LobbyUI.activeGames.get();
  };

  LobbyUI.reloadGames();


  // When the DOM is ready, render templates and bind event handlers
  $(document).ready(function() {

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
    setInterval(LobbyUI.reloadGames, 5000);

    // Set up New Game panel interactions
    (function() {

      var $panel = $('#new_game_panel');
      var $back = $panel.find('.back');
      var $front = $panel.find('.front');
      var $cancel = $panel.find('.cancel');
      var $form = $panel.find('form');

      $back.hide();

      $front.click(function() {
        $front.addClass('zoomOut');
        $back.removeClass('zoomOut').show().addClass('zoomIn');
      });

      $cancel.click(function(event) {
        event.preventDefault();
        $back.addClass('zoomOut').hide();
        $front.removeClass('zoomOut').addClass('zoomIn');
      });

      $form.on('submit', function(event) {
        event.preventDefault();
        var title = $form.get(0).room_name.value;
        if(title !== '') LobbyUI.createAndJoinGame(title);
      });

    }()); // End New Game Panel interactions

  }); // End document ready

}());
