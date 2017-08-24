var App = require("../lib/App.js");
var db = require("../lib/Db.js");

describe("App", function() {
  var Team = function() {
  }

  var nextTeamId = 1;
  function createTeam() {
    var team = new Team();
    team.id = nextTeamId++;
    return team;
  }

  function createPlayer(team) {
    return {
      id: 1,
      teamId: team.id
    };
  }

  var RushingYardsCategory = function() {
  }

  function createRushingYardsCategory() {
    var cat = new RushingYardsCategory();
    cat.id = 1;
    return cat;
  }

  var Week = function() {
  }

  Week.prototype.addStat = function(player, category, value) {
    db.createWeekTeamCategoryStat({
      weekId: this.id,
      teamId: player.teamId,
      categoryId: category.id,
      value: value
      });
  }

  function createWeek() {
    var week = new Week();
    week.id = 1;
    week.seasonId = 1;

    db.createWeek(
      id: week.id,
      seasonId: week.seasonId
    )

    return week;
  }

  beforeEach(function() {
    db.clear();
  });

  it("scores seasonal rushing yards for two teams after a week", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer(teamA);
    var teamBPlayer = createPlayer(teamB);
    var category = createRushingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayer, category, 300);
    week.addStat(teamBPlayer, category, 500);

    var scores = new App().getCategoryScoresForSeason(week.seasonId, category.id);

    expect(scores[teamA.id]).toEqual(1);
    expect(scores[teamB.id]).toEqual(2);
  });

  it("scores seasonal rushing yards and ??? for two teams for a week", function() {
  });

  it("assigns category scores when two teams tie in a category", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer(teamA);
    var teamBPlayer = createPlayer(teamB);
    var category = createRushingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayer, category, 300);
    week.addStat(teamBPlayer, category, 300);

    var categoryScoreForWeek = new App().getScoreForWeek(week.id, category.id);

    expect(categoryScoreForWeek[teamA.id]).toEqual(1.5);
    expect(categoryScoreForWeek[teamB.id]).toEqual(1.5);
  });
});

