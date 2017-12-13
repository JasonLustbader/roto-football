let _ = require("underscore");
let weekStats = [];
let weeks = [];
let playerStates = [];
let categories = [];

module.exports = {
  clear: function() {
    weekStats = [];
    weeks = [];
    playerStates = [];
    categories = [];
  },

  createCategory: function(row) {
    categories.push(row);
  },

  getCategories: function() {
    return categories;
  },

  createWeek: function(row) {
    weeks.push(row);
  },

  createWeekStat: function(row) {
    weekStats.push({
      weekId: row.weekId,
      seasonId: row.seasonId,
      categoryId: row.categoryId,
      playerId: row.playerId,
      value: row.value
    });
  },

  createPlayerState: function(row) {
    playerStates.push(row);

    return row;
  },

  getSeasonStats: function(seasonId) {
    return weekStats.filter(function(stat) {
      return stat.seasonId === seasonId;
    });
  },

  getActivePlayersByWeekId: function(weekId) {
    return playerStates.filter(function(playerState) {
      return playerState.weekId === weekId && playerState.active === true;
    });
  }
}
