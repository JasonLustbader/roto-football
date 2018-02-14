let _ = require("underscore");
let nextTeamId, nextWeekId, weekStats, weeks, playerStates, categories, teams;

module.exports = {
  clear: function() {
    weekStats = [];
    weeks = [];
    playerStates = [];
    categories = [];
    teams = [];
    nextTeamId = 1;
    nextWeekId = 1;
  },

  createTeam: function() {
    let row = {};
    row.id = nextTeamId++;

    teams.push(row);

    return row;
  },

  createCategory: function(row) {
    categories.push(row);
  },

  getCategories: function() {
    return categories;
  },

  createWeek: function(row) {
    let row = Object.assign({}, row);
    row.id = nextWeekId++;

    weeks.push(row);

    return row.id;
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
  },

  getTeamIds: function() {
    return _.map(teams, function(team) { return team.id; });
  }
}
