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

  var nextPlayerId = 1;
  function createPlayer(team) {
    return {
      id: nextPlayerId++,
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

  var Season = function() { }

  function createSeason() {
    var season = new Season();
    season.id = 1;

//    db.createSeason(
//      {
//        id: season.id
//      }
//    );

    return season;

    it("only takes the category stats of active players into account when scoring for a one week, one category season", function() {
    });
  }

  var Week = function(attributes) {
    this._activePlayers = [];
    var instance = this;

    Object.keys(attributes).forEach(function(attribute) {
      instance[attribute] = attributes[attribute];
    });
  }

  Week.prototype.addStat = function(player, category, value) {
    db.createWeekStat({
      weekId: this.id,
      seasonId: this.seasonId,
      categoryId: category.id,
      teamId: player.teamId,
      playerId: player.id,
      value: value
    });
  }

  Week.prototype.activatePlayer = function(player) {
    this._activePlayers.push(player);
  }

  var nextWeekId = 1;
  function createWeek(attributes = {}) {
    attributes = Object.assign(
      {
        id: nextWeekId++
      },
      attributes
    );

    if (typeof(attributes.seasonId) === "undefined" || attributes.seasonId === null) {
      attributes.seasonId = createSeason().id;
    }

    var week = new Week(attributes);

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

  it("scores a category for two teams for a one-week season", function() {
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

  it("scores a category for two teams with two players each for a one-week season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer1 = createPlayer(teamA);
    var teamBPlayer1 = createPlayer(teamB);
    var teamAPlayer2 = createPlayer(teamA);
    var teamBPlayer2 = createPlayer(teamB);
    var category = createRushingYardsCategory();
    var season1 = createSeason();
    var week = createWeek({ seasonId: season1.id });
    week.addStat(teamAPlayer1, category, 100);
    week.addStat(teamBPlayer1, category, 150);
    week.addStat(teamAPlayer2, category, 150);
    week.addStat(teamBPlayer2, category, 50);

    var scores = new App().getCategoryScoresForSeason(week.seasonId, category.id);

    expect(scores[teamA.id]).toEqual(2);
    expect(scores[teamB.id]).toEqual(1);

    // verify that it's not just picking a single player by swapping scores
    var season2 = createSeason();
    week = createWeek({ seasonId: season2.id });
    week.addStat(teamAPlayer1, category, 150);
    week.addStat(teamBPlayer1, category, 50);
    week.addStat(teamAPlayer2, category, 100);
    week.addStat(teamBPlayer2, category, 150);

    var scores = new App().getCategoryScoresForSeason(week.seasonId, category.id);

    expect(scores[teamA.id]).toEqual(2);
    expect(scores[teamB.id]).toEqual(1);
  });

  it("scores a category for two teams for a one-week season when the teams tie", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer(teamA);
    var teamBPlayer = createPlayer(teamB);
    var category = createRushingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayer, category, 300);
    week.addStat(teamBPlayer, category, 300);

    var categoryScoreForWeek = new App().getScoresForSeason(week.seasonId);

    expect(categoryScoreForWeek[teamA.id]).toEqual(1.5);
    expect(categoryScoreForWeek[teamB.id]).toEqual(1.5);
  });

  it("scores multiple categories for two teams for a one-week season", function() {
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

  it("scores a category for two teams for a two-week season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer(teamA);
    var teamBPlayer = createPlayer(teamB);
    var category = createRushingYardsCategory();
    var season = createSeason();
    var week1 = createWeek({ seasonId: season.id });
    week1.addStat(teamAPlayer, category, 300);
    week1.addStat(teamBPlayer, category, 500);
    var week2 = createWeek({ seasonId: season.id });
    week2.addStat(teamAPlayer, category, 500);
    week2.addStat(teamBPlayer, category, 200);

    var scores = new App().getScoresForSeason(season.id);

    expect(scores[teamA.id]).toEqual(2);
    expect(scores[teamB.id]).toEqual(1);
  });

  it("scores multiple categories for two teams for a two-week season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer(teamA);
    var teamBPlayer = createPlayer(teamB);
    var category1 = createRushingYardsCategory();
    var category2 = createReceivingYardsCategory();
    var season = createSeason();
    var week1 = createWeek({ seasonId: season.id });
    week1.addStat(teamAPlayer, category1, 300);
    week1.addStat(teamBPlayer, category1, 500);
    week1.addStat(teamAPlayer, category2, 300);
    week1.addStat(teamBPlayer, category2, 500);
    var week2 = createWeek({ seasonId: season.id });
    week2.addStat(teamAPlayer, category1, 500);
    week2.addStat(teamBPlayer, category1, 200);
    week2.addStat(teamAPlayer, category2, 500);
    week2.addStat(teamBPlayer, category2, 200);

    var scores = new App().getScoresForSeason(season.id);

    expect(scores[teamA.id]).toEqual(4);
    expect(scores[teamB.id]).toEqual(2);
  });

  it("only takes the category stats of active players into account when scoring for a one week, one category season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayerActive = createPlayer(teamA);
    var teamBPlayerActive = createPlayer(teamB);
    var teamAPlayerInactive = createPlayer(teamA);
    var teamBPlayerInactive = createPlayer(teamB);
    var category = createRushingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayerActive, category, 300);
    week.addStat(teamBPlayerActive, category, 500);
    week.addStat(teamAPlayerInactive, category, 500);
    week.addStat(teamBPlayerInactive, category, 300);
    week.activatePlayer(teamAPlayerActive);
    week.activatePlayer(teamBPlayerActive);

    var scores = new App().getCategoryScoresForSeason(week.seasonId, category.id);

    expect(scores[teamA.id]).toEqual(1);
    expect(scores[teamB.id]).toEqual(2);
  });

  it("gives teams without a sufficient number of active players 0 points");
});

