var stats = [];
var weeks = [];

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

  getSeasonScoresByTeamIdSortedByValueAsc: function(seasonId, categoryId) {
    var cumulativeValues = stats.filter(function(stat) {
      return stat.seasonId === seasonId && stat.categoryId === categoryId;
    }).reduce(function(m, stat) {
      var val = m[stat.teamId];

      if (val === undefined || val === null)
        val = 0;

      m[stat.teamId] = val + stat.value;

      return m;
    }, {});

    return Object.keys(cumulativeValues).map(function(key) {
      return { teamId: key, value: cumulativeValues[key] };
    }).sort(function(stat1, stat2) {
      return stat1.value - stat2.value;
    });
  }
}
