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
      id: 1
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

  Week.prototype.addStat = function(team, category, value) {
    db.createWeekTeamCategoryStat(this.id, team.id, category.id, value);
  }

  function createWeek() {
    var week = new Week();
    week.id = 1;
    return week;
  }

  it("scores passing yards for two teams for a week", function() {
    // Team A - 300 passing yards
    // Team B - 500 passing yards
    /*
     * week_stats
     * - id
     * - player_id
     * - week_id
     *
     * category_week_stats
     * - w_s_id
     * - category_id
     * - value
     *
     * players
     * - id
     * - name
     * - team_id
     *
     * // sum of passing yards by team, by week
     * select ws.week_id, players.team_id, sum(cws.value) as value_sum
     * from category_week_stats cws
     * inner join week_stats ws on ws.id = cws.w_s_id
     * inner join players on players.id = ws.player_id
     * where category_id = (
     *   select id
     *   from categories
     *   where name = 'Rushing Yards'
     *   limit 1
     *   )
     * group by ws.week_id, players.team_id
     * order by value_sum desc
     */

    var teamA = createTeam();
    var teamB = createTeam();
    var teamAPlayer = createPlayer(teamA);
    var teamBPlayer = createPlayer(teamB);
    var category = createRushingYardsCategory();
    var week = createWeek();
    week.addStat(teamAPlayer, category, 300);
    week.addStat(teamBPlayer, category, 500);

    var categoryScoreForWeek = new App().getScoreForWeek(week.id, category.id);

    expect(categoryScoreForWeek[teamA.id]).toEqual(1);
    expect(categoryScoreForWeek[teamB.id]).toEqual(2);
  });

  // team 1 has 300 passing yards
  // team 2 has 300 passing yards
  // expect(team1.score).to eq team2.score
  it("assigns category scores when two teams tie in a category");
});

