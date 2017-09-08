var db = require("./Db.js");

module.exports = class {
  getScoresForSeason(seasonId) {
    var categories = db.getCategories();
    var cumulativeScores = {};
    var that = this;

    categories.forEach(function(category) {
      var scores = that.getCategoryScoresForSeason(seasonId, category.id);

      Object.keys(scores).forEach(function(teamId) {
        var value = cumulativeScores[teamId] || 0;
        cumulativeScores[teamId] = value + scores[teamId];
      });
    });

    return cumulativeScores;
  }

  getCategoryScoresForSeason(seasonId, categoryId) {
    // SELECT seasonId, teamId, categoryId, SUM(value) from stats GROUP BY seasonId, teamId, categoryId
    var stats = db.getSeasonScoresByTeamIdSortedByValueAsc(seasonId, categoryId);

    var singleCategoryScores = {};
    var statBuffer = [];

    for (var i = 0; i < stats.length; i++) {
      if (i === 0 || stats[i].value === statBuffer[0].value) {
        statBuffer.push(stats[i]);
      } else {
        Object.assign(
          singleCategoryScores,
          this.assignScores(i, statBuffer)
        );
        statBuffer = [stats[i]];
      }
    }
    Object.assign(
      singleCategoryScores,
      this.assignScores(stats.length, statBuffer)
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
