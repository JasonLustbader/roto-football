let _ = require("underscore");
let nextCategoryId, nextTeamId, nextWeekId, weekStats, weeks, playerStates, categories, teams;

module.exports = {
  clear: function() {
    weekStats = [];
    weeks = [];
    playerStates = [];
    categories = [];
    teams = [];
    nextTeamId = 1;
    nextWeekId = 1;
    nextWeekStatsId = 1;
  },

  createTeam: function(row) {
    row = Object.assign({}, row);
    row.id = nextTeamId++;

    teams.push(row);

    return row.id;
  },

  createCategory: function(row) {
    row = Object.assign({}, row);
    row.id = nextCategoryId++;

    categories.push(row);

    return row.id;
  },

  getCategories: function() {
    return categories;
  },

  createWeek: function(row) {
    row = Object.assign({}, row);
    row.id = nextWeekId++;

    weeks.push(row);

    return row.id;
  },

  createWeekStat: function(row) {
    row = Object.assign({}, row);
    row.id = nextWeekStatsId++;

    weekStats.push(row);

    return row.id;
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
