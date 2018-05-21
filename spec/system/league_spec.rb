require "rails_helper"

describe "visiting /league page", type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
  end

  let(:player_a) { create(:player) }
  let(:player_b) { create(:player) }

  context "with two teams" do
    let(:team_a) { create(:team) }
    let(:team_b) { create(:team) }

    context "in a one week season" do
      let(:week) { create(:week) }

      context "with one category" do
        let(:category) { create(:category) }

        it "scores the teams on the page" do
          create(:player_state, player: player_a, team: team_a, week: week, active: true)
          create(:player_state, player: player_b, team: team_b, week: week, active: true)
          create(:week_metric, week: week, player: player_a, category: category, value: 300)
          create(:week_metric, week: week, player: player_b, category: category, value: 500)

          TeamCategoryRanking.calculate

          visit '/league'

          team_a_ranking = find("team-#{team_a.id}").value
          team_b_ranking = find("team-#{team_b.id}").value

          expect(team_a_ranking).to eq("1")
          expect(team_b_ranking).to eq("2")
        end
      end
    end
  end
end
