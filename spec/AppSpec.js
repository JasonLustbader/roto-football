var _ = require("underscore");
var App = require("../lib/App.js");
var db = require("../lib/Db.js");

describe("App", function() {
  var Team = function() {
  }

  function createTeam() {
    var team = new Team();

    let record = db.createTeam();

    team.id = record.id;

    return team;
  }

  var nextPlayerId = 1;
  function createPlayer() {
    return {
      id: nextPlayerId++
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
  }
  var PlayerState = function(attributes) {
    // TODO: this class needs to support record ids for the below objects when they're coming from the database
    this.week = attributes.week;
    this.team = attributes.team;
    this.player = attributes.player;
    this.active = attributes.active;
  }

  function createPlayerState(attributes = {}) {
    var playerState = new PlayerState(attributes);

    db.createPlayerState({
      teamId: playerState.team.id,
      weekId: playerState.week.id,
      playerId: playerState.player.id,
      active: playerState.active
    });

    return playerState;
  }

  var Week = function(attributes) {
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
    var teamAPlayer = createPlayer();
    var teamBPlayer = createPlayer();
    var category = createRushingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayer, category, 300);
    week.addStat(teamBPlayer, category, 500);

    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayer,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayer,
      active: true
    });

    var scores = new App().getScoresForSeason(week.seasonId);

    expect(scores[teamA.id]).toEqual(1);
    expect(scores[teamB.id]).toEqual(2);
  });

  it("scores a category for two teams with two players each for a one-week season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer1 = createPlayer();
    var teamBPlayer1 = createPlayer();
    var teamAPlayer2 = createPlayer();
    var teamBPlayer2 = createPlayer();
    var category = createRushingYardsCategory();
    var season1 = createSeason();
    var week = createWeek({ seasonId: season1.id });
    week.addStat(teamAPlayer1, category, 100);
    week.addStat(teamBPlayer1, category, 150);
    week.addStat(teamAPlayer2, category, 150);
    week.addStat(teamBPlayer2, category, 50);

    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayer1,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayer2,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayer1,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayer2,
      active: true
    });

    var scores = new App().getScoresForSeason(week.seasonId);

    expect(scores[teamA.id]).toEqual(2);
    expect(scores[teamB.id]).toEqual(1);

    // verify that it's not just picking a single player by swapping scores
    var season2 = createSeason();
    week = createWeek({ seasonId: season2.id });
    week.addStat(teamAPlayer1, category, 150);
    week.addStat(teamBPlayer1, category, 50);
    week.addStat(teamAPlayer2, category, 100);
    week.addStat(teamBPlayer2, category, 150);

    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayer1,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayer2,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayer1,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayer2,
      active: true
    });

    var scores = new App().getScoresForSeason(week.seasonId);

    expect(scores[teamA.id]).toEqual(2);
    expect(scores[teamB.id]).toEqual(1);
  });

  it("scores a category for two teams for a one-week season when the teams tie", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer();
    var teamBPlayer = createPlayer();
    var category = createRushingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayer, category, 300);
    week.addStat(teamBPlayer, category, 300);

    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayer,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayer,
      active: true
    });

    var categoryScoreForWeek = new App().getScoresForSeason(week.seasonId);

    expect(categoryScoreForWeek[teamA.id]).toEqual(1.5);
    expect(categoryScoreForWeek[teamB.id]).toEqual(1.5);
  });

  it("scores multiple categories for two teams for a one-week season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer();
    var teamBPlayer = createPlayer();
    var category1 = createRushingYardsCategory();
    var category2 = createReceivingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayer, category1, 300);
    week.addStat(teamBPlayer, category1, 500);
    week.addStat(teamAPlayer, category2, 300);
    week.addStat(teamBPlayer, category2, 500);

    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayer,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayer,
      active: true
    });

    var scores = new App().getScoresForSeason(week.seasonId);

    expect(scores[teamA.id]).toEqual(2);
    expect(scores[teamB.id]).toEqual(4);
  });

  it("scores a category for two teams for a two-week season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer();
    var teamBPlayer = createPlayer();
    var category = createRushingYardsCategory();
    var season = createSeason();
    var week1 = createWeek({ seasonId: season.id });
    week1.addStat(teamAPlayer, category, 300);
    week1.addStat(teamBPlayer, category, 500);
    var week2 = createWeek({ seasonId: season.id });
    week2.addStat(teamAPlayer, category, 500);
    week2.addStat(teamBPlayer, category, 200);

    createPlayerState({
      week: week1,
      team: teamA,
      player: teamAPlayer,
      active: true
    });
    createPlayerState({
      week: week1,
      team: teamB,
      player: teamBPlayer,
      active: true
    });
    createPlayerState({
      week: week2,
      team: teamA,
      player: teamAPlayer,
      active: true
    });
    createPlayerState({
      week: week2,
      team: teamB,
      player: teamBPlayer,
      active: true
    });

    var scores = new App().getScoresForSeason(season.id);

    expect(scores[teamA.id]).toEqual(2);
    expect(scores[teamB.id]).toEqual(1);
  });

  it("scores multiple categories for two teams for a two-week season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer();
    var teamBPlayer = createPlayer();
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

    createPlayerState({
      week: week1,
      team: teamA,
      player: teamAPlayer,
      active: true
    });
    createPlayerState({
      week: week1,
      team: teamB,
      player: teamBPlayer,
      active: true
    });
    createPlayerState({
      week: week2,
      team: teamA,
      player: teamAPlayer,
      active: true
    });
    createPlayerState({
      week: week2,
      team: teamB,
      player: teamBPlayer,
      active: true
    });

    var scores = new App().getScoresForSeason(season.id);

    expect(scores[teamA.id]).toEqual(4);
    expect(scores[teamB.id]).toEqual(2);
  });

  it("only takes the category stats of active players into account when scoring for a one week, one category season", function() {
    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayerActive = createPlayer();
    var teamBPlayerActive = createPlayer();
    var teamAPlayerInactive = createPlayer();
    var teamBPlayerInactive = createPlayer();
    var category = createRushingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayerActive, category, 300);
    week.addStat(teamBPlayerActive, category, 500);
    week.addStat(teamAPlayerInactive, category, 500);
    week.addStat(teamBPlayerInactive, category, 300);

    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayerActive,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamA,
      player: teamAPlayerInactive,
      active: false
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayerActive,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamB,
      player: teamBPlayerInactive,
      active: false
    });

    var scores = new App().getScoresForSeason(week.seasonId);

    expect(scores[teamA.id]).toEqual(1);
    expect(scores[teamB.id]).toEqual(2);
  });

  // This could happen if a team hasn't played yet for a given week
  it("defaults the sum of stats for a team in a given category to 0 if a team has not accrued any stats in that category", function() {
    var week = createWeek();
    var category = createRushingYardsCategory();
    var teamWithStats = createTeam();
    var teamWithoutStats = createTeam();
    var playerWithStats = createPlayer();
    var playerWithoutStats = createPlayer();

    createPlayerState({
      week: week,
      team: teamWithStats,
      player: playerWithStats,
      active: true
    });
    createPlayerState({
      week: week,
      team: teamWithoutStats,
      player: playerWithoutStats,
      active: true
    });

    week.addStat(playerWithStats, category, 100);

    var scores = new App().getScoresForSeason(week.seasonId);

    expect(scores[teamWithStats.id]).toEqual(2);
    expect(scores[teamWithoutStats.id]).toEqual(1);
  });

  it("gives teams without a sufficient number of active players 0 points");
});

