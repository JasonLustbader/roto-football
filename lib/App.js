var _ = require("underscore");
var db = require("./Db.js");

module.exports = class {
  getScoresForSeason(seasonId) {
    /*
     * For each category, the number of points a team gets is equal to the rank
     * of the team, stacked against all other teams, in descending order.
     *
     * The points for each category are summed to get the cumulative score.
     */

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
      var activePlayers = db.getActivePlayersByWeekId(parseInt(weekId));
      var activeStats = statsByWeek[weekId].reduce(function(m, stat) {
        let activePlayer = activePlayers.filter(function(player) { return player.playerId === stat.playerId })[0];

        if (activePlayer !== undefined) {
          m.push(_.extend({ teamId: activePlayer.teamId }, stat));
        }

        return m;
      }, []);
      statsByWeek[weekId] = activeStats;
    });

    var statsByCategory = {}
    _.values(statsByWeek).forEach(function(weekStats) {
      weekStats.forEach(function(weekStat) {
        let categoryStats = statsByCategory[weekStat.categoryId];

        if (categoryStats === undefined)
          statsByCategory[weekStat.categoryId] = categoryStats = [];

        categoryStats.push(weekStat);
      });
    });

    let that = this;

    return _.values(statsByCategory).reduce(function(cumulativeScores, categoryStats) {
      let scoresByTeam = that.assignScoresOuter(categoryStats);

      Object.keys(scoresByTeam).forEach(function(teamId) {
        let value = cumulativeScores[teamId] || 0;
        cumulativeScores[teamId] = value + scoresByTeam[teamId];
      });

      return cumulativeScores;
    }, {});
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
