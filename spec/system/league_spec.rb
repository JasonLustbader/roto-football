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
        end
      end
    end
  end

  it "shows the score for two teams in a one category, one week season" do

    visit "/league"

    team_list = find("#team_list")
    expect(team_list).to have_text("Team A")
    expect(team_list).to have_text("Team B")
  end
end
