require 'rails_helper'

RSpec.describe TeamCategoryRanking, type: :model do
  describe "validations" do
    it "creates" do
      create(:team_category_ranking)
    end

    it "doesn't create when team is nil" do
      expect{ create(:team_category_ranking, team: nil) }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it "doesn't create when category is nil" do
      expect{ create(:team_category_ranking, category: nil) }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end

  describe "#calculate" do
    context "with one week" do
      let(:week) { create(:week) }
      let(:team_a) { create(:team) }
      let(:team_b) { create(:team) }
      let(:player_a) { create(:player) }
      let(:player_b) { create(:player) }
      let(:category) { create(:category) }

      before do
        create(:player_state, team: team_a, week: week, player: player_a)
        create(:player_state, team: team_b, week: week, player: player_b)
      end

      it "gives one point for each spot higher in the rankings" do
        team_a_stat = rand(100)
        team_b_stat = team_a_stat - rand(1..100)
        create(:week_metric, week: week, player: player_a, category: category, value: team_a_stat)
        create(:week_metric, week: week, player: player_b, category: category, value: team_b_stat)

        TeamCategoryRanking.calculate
        expect(TeamCategoryRanking.find_by(team: team_a, category: category).value).to eq(2)
        expect(TeamCategoryRanking.find_by(team: team_b, category: category).value).to eq(1)
      end
    end
  end
end
