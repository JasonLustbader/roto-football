let _ = require("underscore");
let tables;
const tableNames = ["categories", "playerStates", "teams", "weeks", "weekStats"];

let createRow = function(tableName, row) {
  row = Object.assign({}, row);
  table = tables[tableName];

  row.id = table.next++;
  table.data.push(row);

  return row.id;
};

module.exports = {
  clear: function() {
    tables = {};
    tableNames.forEach(function(tableName) {
      tables[tableName] = {next: 0, data: []};
    });
  },

  createCategory: function(row) {
    return createRow("categories", row);
  },

  createPlayerState: function(row) {
    return createRow("playerStates", row);
  },

  createTeam: function(row) {
    return createRow("teams", row);
  },

  createWeek: function(row) {
    return createRow("weeks", row);
  },

  createWeekStat: function(row) {
    return createRow("weekStats", row);
  },

  getActivePlayersByWeekId: function(weekId) {
    let data = tables["playerStates"].data.filter(function(playerState) {
      return playerState.weekId === weekId && playerState.active === true;
    });

    return JSON.parse(JSON.stringify(data));
  },

  getCategories: function() {
    let data = tables["categories"].data;

    return JSON.parse(JSON.stringify(data));
  },

  getSeasonStats: function(seasonId) {
    let data = tables["weekStats"].data.filter(function(stat) {
      return stat.seasonId === seasonId;
    });

    return JSON.parse(JSON.stringify(data));
  },

  getTeamIds: function() {
    let data = _.map(tables["teams"].data, function(team) { return team.id; });

    return data;
  }
}
