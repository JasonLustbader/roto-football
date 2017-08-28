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
    stats.push({
      weekId: row.weekId,
      teamId: row.teamId,
      categoryId: row.categoryId,
      value: row.value
    });
  },

  getSeasonStatsBySeasonIdAndCategoryIdSortedByValueAsc: function(weekId, categoryId) {
    return stats.filter(function(stat) {
      return stat.weekId === weekId && stat.categoryId === categoryId;
    }).sort(function(stat1, stat2) {
      return stat1.value - stat2.value;
    });
  }
}
