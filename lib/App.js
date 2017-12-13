let _ = require("underscore");
let db = require("./Db.js");

module.exports = class {
  getScoresForSeason(seasonId) {
    /*
     * For each category, the number of points a team gets is equal to the rank
     * of the team, stacked against all other teams, in descending order.
     *
     * The points for each category are summed to get the cumulative score.
     */
    let that = this;
    let activePlayerStats = this.getActiveStatsForSeason(seasonId);
    let statsByCategory = this.getStatsByCategory(activePlayerStats);

    return _.values(statsByCategory).reduce(function(cumulativeScores, categoryStats) {
      let scoresByTeam = that.assignScoresOuter(categoryStats);

      Object.keys(scoresByTeam).forEach(function(teamId) {
        let value = cumulativeScores[teamId] || 0;
        cumulativeScores[teamId] = value + scoresByTeam[teamId];
      });

      return cumulativeScores;
    }, {});
  }

  getStatsByCategory(stats) {
    return stats.reduce(function(statsByCategory, stat) {
      let categoryStats = statsByCategory[stat.categoryId];

      if (categoryStats === undefined)
        statsByCategory[stat.categoryId] = categoryStats = [];

      categoryStats.push(stat);

      return statsByCategory;
    }, {});
  }

  getActiveStatsForSeason(seasonId) {
    let statsByWeek = db.getSeasonStats(seasonId).
      reduce(function(m, stat) {
        let weekStats = m[stat.weekId];
        if (weekStats === undefined) {
          m[stat.weekId] = weekStats = [];
        }
        weekStats.push(stat);
        return m;
      }, {});

    Object.keys(statsByWeek).forEach(function(weekId) {
      let activePlayers = db.getActivePlayersByWeekId(parseInt(weekId));
      let activeStats = statsByWeek[weekId].reduce(function(m, stat) {
        let activePlayer = activePlayers.filter(function(player) { return player.playerId === stat.playerId })[0];

        if (activePlayer !== undefined) {
          m.push(_.extend({ teamId: activePlayer.teamId }, stat));
        }

        return m;
      }, []);
      statsByWeek[weekId] = activeStats;
    });

    return _.flatten(_.values(statsByWeek));
  }

  assignScoresOuter(rawStats) {
    let cumulativeValues = rawStats.reduce(function(m, stat) {
      let val = m[stat.teamId];

      if (val === undefined || val === null)
        val = 0;

      m[stat.teamId] = val + stat.value;

      return m;
    }, {});

    let stats = Object.keys(cumulativeValues).map(function(key) {
      return { teamId: key, value: cumulativeValues[key] };
    }).sort(function(stat1, stat2) {
      return stat1.value - stat2.value;
    });
    let singleCategoryScores = {};
    let statBuffer = [];

    for (let i = 0; i < stats.length; i++) {
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
    let score;
    let numScores = stats.length;

    if (numScores === 1) {
      score = index;
    } else {
      score = (index - numScores) + 1.0 * (numScores - 1) / numScores + 1;
    }

    let result = {};
    for (let j=0; j < stats.length; j++) {
      result[stats[j].teamId] = score;
    }
    return result;
  }
};
