var db = require("./Db.js");

module.exports = class {
  getScoreForWeek(weekId, categoryId) {
    var results = db.getWeekStatsByWeekIdAndCategoryIdSortedByValueAsc(weekId, categoryId);

    var singleCategoryScores = {};
    for (var i=0; i < results.length; i++) {
      singleCategoryScores[results[i].teamId] = i+1;
    }

    return singleCategoryScores;
  }
};
