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

  class Category {
    constructor(name) {
      this.name = name;
    }

    save() {
      db.createCategory({
        id: this.id,
        name: this.name
      });
    }
  }

  function createRushingYardsCategory() {
    var cat = new Category("rushing_yards");
    cat.id = 1;
    cat.save();
    return cat;
  }

  function createReceivingYardsCategory() {
    var cat = new Category("receiving_yards");
    cat.id = 2;
    cat.save();
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
      {
        id: week.id,
        seasonId: week.seasonId
      }
    );

    return week;
  }

  beforeEach(function() {
    db.clear();
  });

  it("scores rushing yards for two teams after a week", function() {
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

  it("scores rushing yards and receiving yards for two teams for a week", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer(teamA);
    var teamBPlayer = createPlayer(teamB);
    var category1 = createRushingYardsCategory();
    var category2 = createReceivingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayer, category1, 300);
    week.addStat(teamBPlayer, category1, 500);
    week.addStat(teamAPlayer, category2, 300);
    week.addStat(teamBPlayer, category2, 500);

    var scores = new App().getScoresForSeason(week.seasonId);

    expect(scores[teamA.id]).toEqual(2);
    expect(scores[teamB.id]).toEqual(4);
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

    var categoryScoreForWeek = new App().getCategoryScoresForSeason(week.seasonId, category.id);

    expect(categoryScoreForWeek[teamA.id]).toEqual(1.5);
    expect(categoryScoreForWeek[teamB.id]).toEqual(1.5);
  });
});

