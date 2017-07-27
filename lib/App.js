var db = require("Db.js");

module.exports = class {
  getScoreForWeek(weekId, categoryId) {
    results = db.getWeekStatsByWeekIdAndCategoryIdSortedByValueAsc(weekId, categoryId);

    var singleCategoryScores = {};
    for (i=0; i < results.length; i++) {
      singleCategoryScores[results[i].teamId] = i+1; // rank points
    }

    return singleCategoryScores;
  }
};
