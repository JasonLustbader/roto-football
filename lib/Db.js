let _ = require("underscore");
let tables;
const tableNames = ["categories", "playerStates", "teams", "weeks", "weekStats"];

module.exports = {
  clear: function() {
    tables = {};
    tableNames.forEach(function(tableName) {
      tables[tableName] = {next: 0, data: []};
    });
  },

  createCategory: function(row) {
    row = Object.assign({}, row);
    table = tables["categories"];

    row.id = table.next++;
    table.data.push(row);

    return row.id;
  },

  createPlayerState: function(row) {
    row = Object.assign({}, row);
    table = tables["playerStates"];

    row.id = table.next++;
    table.data.push(row);

    return row.id;
  },

  createTeam: function(row) {
    row = Object.assign({}, row);
    table = tables["teams"];

    row.id = table.next++;
    table.data.push(row);

    return row.id;
  },

  createWeek: function(row) {
    row = Object.assign({}, row);
    table = tables["weeks"];

    row.id = table.next++;
    table.data.push(row);

    return row.id;
  },

  createWeekStat: function(row) {
    row = Object.assign({}, row);
    table = tables["weekStats"];

    row.id = table.next++;
    table.data.push(row);

    return row.id;
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

    return JSON.parse(JSON.stringify(data));
  }
}
