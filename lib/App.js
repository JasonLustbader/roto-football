var db = require("./Db.js");

module.exports = class {
  getCategoryScoreForSeason(seasonId, categoryId) {
    var stats = db.getSeasonStatsBySeasonIdAndCategoryIdSortedByValueAsc(seasonId, categoryId);

    var singleCategoryScores = {};
    var statBuffer = [];

    for (var i=0; i < weekStats.length; i++) {
      if (i === 0 || weekStats[i].value === statBuffer[0].value) {
        statBuffer.push(weekStats[i]);
      } else {
        Object.assign(
          singleCategoryScores,
          this.assignScores(i, statBuffer)
        );
        statBuffer = [weekStats[i]];
      }
    }
    Object.assign(
      singleCategoryScores,
      this.assignScores(weekStats.length, statBuffer)
    );

    return singleCategoryScores;
  }

  assignScores(index, stats) {
    var score;
    var numScores = stats.length;

    if (numScores === 1) {
      score = index;
    } else {
      score = (index - numScores) + 1.0 * (numScores - 1) / numScores + 1;
    }

    var result = {};
    for (var j=0; j < stats.length; j++) {
      result[stats[j].teamId] = score;
    }
    return result;
  }
};
