var PlayerStatsApp = PlayerStatsApp || {};

PlayerStatsApp = (function() {
  var init = function() {
    playerStatsCard.init();
  };

  return {
      init: init
  };
})();

PlayerStatsApp.init();