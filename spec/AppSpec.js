App = require("../lib/App.js");

describe("App", function() {
  function createTeam() {
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
    week.addStat(category, teamAPlayer, 300);
    week.addStat(category, teamBPlayer, 500);

    var categoryScoreForWeek = new App().getScoreForWeek(week.id, category.id);

    equals(categoryScoreForWeek[teamA.id], 1);
    equals(categoryScoreForWeek[teamB.id], 2);
  });
});

