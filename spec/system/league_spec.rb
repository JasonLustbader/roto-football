require "rails_helper"

describe "visiting /league page", type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
  end

  it "shows the team names" do
    create(:team, name: "Team A")
    create(:team, name: "Team B")

    visit "/league"

    team_list = find("#team_list")
    expect(team_list).to have_text("Team A")
    expect(team_list).to have_text("Team B")
  end
end
