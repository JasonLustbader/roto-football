var _ = require("underscore");
var stats = [];
var weeks = [];
var nextTeamWeekId = 0;
var teamWeeks = [];

module.exports = {
  clear: function() {
    stats = [];
    weeks = [];
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
    stats.push({
      weekId: row.weekId,
      seasonId: row.seasonId,
      categoryId: row.categoryId,
      teamId: row.teamId,
      playerId: row.playerId,
      value: row.value
    });
  },

  createTeamWeek: function(row) {
    var dbRecord = _.extend({id: nextTeamWeekId++}, row);

    teamWeeks.push(dbRecord);

    return dbRecord;
  },

  getSeasonStats: function(seasonId) {
    return stats.filter(function(stat) {
      return stat.seasonId === seasonId;
    });
  },

  getStatsBySeasonIdAndCategoryId: function(seasonId, categoryId) {
    return stats.filter(function(stat) {
      return stat.seasonId === seasonId && stat.categoryId === categoryId;
    });
  },

  getActivePlayersByWeekId: function(weekId) {
    return [];
  }
}
