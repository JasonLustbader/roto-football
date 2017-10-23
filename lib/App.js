var _ = require("underscore");
var db = require("./Db.js");

module.exports = class {
  getScoresForSeason1(seasonId) {
    var statsByWeek = db.getSeasonStats(seasonId).
      reduce(function(m, stat) {
        var weekStats = m[stat.weekId];
        if (weekStats === undefined) {
          m[stat.weekId] = weekStats = [];
        }
        weekStats.push(stat);
        return m;
      }, {});

    Object.keys(statsByWeek).forEach(function(weekId) {
      var activePlayers = db.getActivePlayersForWeek(weekId);
      var activeStats = statsByWeek[weekId].filter(function(stat) {
        activePlayers.includes(stat.playerId);
      });
      statsByWeek[weekId] = activeStats;
    });

    var flattenedStatsByWeek = _.flatten(_.values(statsByWeek));

    assignScoresOuter(flattenedStatsByWeek);
  }

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

  assignScoresOuter(rawStats) {
    var cumulativeValues = rawStats.reduce(function(m, stat) {
      var val = m[stat.teamId];

      if (val === undefined || val === null)
        val = 0;

      m[stat.teamId] = val + stat.value;

      return m;
    }, {});

    var stats = Object.keys(cumulativeValues).map(function(key) {
      return { teamId: key, value: cumulativeValues[key] };
    }).sort(function(stat1, stat2) {
      return stat1.value - stat2.value;
    });
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

  getCategoryScoresForSeason(seasonId, categoryId) {
    // SELECT seasonId, teamId, categoryId, SUM(value) from stats GROUP BY seasonId, teamId, categoryId
    var stats = db.getSeasonScoresByTeamIdSortedByValueAsc(seasonId, categoryId);

    return this.assignScoresOuter(stats);
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
