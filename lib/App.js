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
    let teamIds = db.getTeamIds();
    let activePlayerStats = this.getActiveStatsForSeason(seasonId);
    let statsByCategory = this.getStatsByCategory(activePlayerStats);
    let scoresByCategoryByTeam = {};

    return Object.keys(statsByCategory).reduce(function(cumulativeScores, category) {
      let categoryStats = statsByCategory[category];
      let categoryTeamScores = scoresByCategoryByTeam[category] = {};

      let scoresByTeam = _.extend(
        categoryTeamScores,
        that.getCategoryScoresByTeam(categoryStats, teamIds)
      );

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

  getCategoryScoresByTeam(rawStats, teamIds) {
    let scoreTotalsByTeam = teamIds.reduce(function(m, teamId) {
      m[teamId] = 0;
      return m;
    }, {});

    rawStats.forEach(function(stat) {
      let val = scoreTotalsByTeam[stat.teamId];

      if (val === undefined || val === null)
        val = 0;

      scoreTotalsByTeam[stat.teamId] = val + stat.value;
    });

    let teamTotalScoresAscending = Object.keys(scoreTotalsByTeam).map(function(key) {
      return { teamId: key, value: scoreTotalsByTeam[key] };
    }).sort(function(teamTotalScore1, teamTotalScore2) {
      return teamTotalScore1.value - teamTotalScore2.value;
    });
    let categoryScores = {};
    let teamIdsWithSameTotal = [];
    let currentTotal;

    for (let i = 0; i < teamTotalScoresAscending.length; i++) {
      if (i === 0 || teamTotalScoresAscending[i].value === currentTotal) {
        teamIdsWithSameTotal.push(teamTotalScoresAscending[i].teamId);
      } else {
        Object.assign(
          categoryScores,
          this.calculateScoresForRank(i, teamIdsWithSameTotal)
        );

        teamIdsWithSameTotal = [teamTotalScoresAscending[i].teamId];
      }
      currentTotal = teamTotalScoresAscending[i].value;
    }
    Object.assign(
      categoryScores,
      this.calculateScoresForRank(teamTotalScoresAscending.length, teamIdsWithSameTotal)
    );

    return categoryScores;
  }

  calculateScoresForRank(rank, teamsWithCategoryValue) {
    let score;
    let numScores = teamsWithCategoryValue.length;

    if (numScores === 1) {
      score = rank;
    } else {
      score = 1 + (rank - numScores) + 1.0 * (numScores - 1) / numScores;
    }

    let result = {};
    for (let j=0; j < teamsWithCategoryValue.length; j++) {
      result[teamsWithCategoryValue[j]] = score;
    }
    return result;
  }
};
