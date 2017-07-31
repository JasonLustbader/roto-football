var stats = [];

module.exports = {
  createPlayer: function(teamId) {
    return {
      id: 1
    };
  },

  createWeekTeamCategoryStat: function(weekId, playerId, categoryId, value) {
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
