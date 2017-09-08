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

  createWeekTeamCategoryStat: function(row) {
    var week = weeks.filter(function(week) { return week.id === row.weekId })[0];

    stats.push({
      weekId: row.weekId,
      seasonId: week.seasonId,
      teamId: row.teamId,
      categoryId: row.categoryId,
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
