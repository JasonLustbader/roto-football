var stats = [];

module.exports = {
  clear: function() {
    stats = [];
  },

  createWeekTeamCategoryStat: function(row) {
    stats.push({
      weekId: row.weekId,
      teamId: row.teamId,
      categoryId: row.categoryId,
      value: row.value
    });
  },

  getWeekStatsByWeekIdAndCategoryIdSortedByValueAsc: function(weekId, categoryId) {
    return stats.filter(function(stat) {
      return stat.weekId === weekId && stat.categoryId === categoryId;
    }).sort(function(stat1, stat2) {
      return stat1.value - stat2.value;
    });
  }
}
