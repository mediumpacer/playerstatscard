'use strict'
var playerStatsCard = (function () {

  var playersJSONUrl = 'modules/playerstatscard/data/player-stats.json',
      playersData,
      currentPlayerId;

  // initialise and load player data
  function init() {
    loadJSON(playersJSONUrl, function(data) {
      playersData = JSON.parse(data).players;
      buildComponent();
      bindEvents();
    });
  }

  function loadJSON(url, callback) {
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");
    request.open("GET", url, true);
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status == "200") {
        callback(request.responseText);
      }
    }
    request.send(null);
  }

  // build initial template
  function buildComponent() {
    document.querySelector('.player-card').innerHTML = PlayerStatsCardTemplates['player-card']({ 
      players: playersData 
    });

    renderPlayer(playersData[0].player.id);
  }

  // setup events for player selector dropdown
  function bindEvents() {
    var playerSelector = document.querySelector('.player-card__selector');

    playerSelector.onchange = function() {
      var index = this.selectedIndex;
      if (index > 0) {
        var selectedPlayerId = parseInt(this.children[index].getAttribute('value'));

        if (selectedPlayerId === currentPlayerId) return;

        renderPlayer(selectedPlayerId);
        currentPlayerId = selectedPlayerId;
      }
    }
  }

  // display the player data
  function renderPlayer(playerId) {
    console.log('render');
    var selectedPlayer = getPlayerByID(playersData, playerId),    
        appearances = getStatsValue('appearances'),
        goals = getStatsValue('goals'),
        assists = getStatsValue('goal_assist'),
        minsPlayed = getStatsValue('mins_played'),
        totalPasses = getStatsValue('fwd_pass') + getStatsValue('backward_pass'),
        playerStats = {
          "appearances":  appearances,
          "goals":  goals,
          "assists": assists,
          "goalsPerMatch": Math.round((goals / appearances) * 100) / 100,
          "passesPerMin": Math.round((totalPasses / minsPlayed) * 100) / 100
        };

    function getStatsValue(key) {
      var keyValue = selectedPlayer.stats.filter(function(item){return item.name == key;})[0]; 
      return (keyValue !== undefined) ? keyValue.value : 0;
    }

    document.querySelector('.player-card__container').innerHTML = PlayerStatsCardTemplates['player-card-content']({ 
      player: selectedPlayer.player,
      stats: playerStats        
    });
  }

  function getPlayerByID(arr, value) {
    var result  = arr.filter(function(item){return item.player.id == value;} );
    return result? result[0] : null;
  }

  return {
    init: init
  };

})();
