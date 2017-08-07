var stats = [];

module.exports = {
  createWeekTeamCategoryStat: function(weekId, playerId, teamId, categoryId, value) {
    stats.push({
      weekId: weekId,
      teamId: teamId,
      categoryId: categoryId,
      value: value
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
