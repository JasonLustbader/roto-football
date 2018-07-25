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

    it "gives equal points for teams tied in the rankings" do
      team_a_stat = rand(100)
      team_b_stat = team_a_stat
      create(:week_metric, week: week, player: player_a, category: category, value: team_a_stat)
      create(:week_metric, week: week, player: player_b, category: category, value: team_b_stat)

      TeamCategoryRanking.calculate
      expect(TeamCategoryRanking.find_by(team: team_a, category: category).value).to eq(1.5)
      expect(TeamCategoryRanking.find_by(team: team_b, category: category).value).to eq(1.5)
    end

    it "gives one point for each spot higher in the rankings across multiple categories" do
      category2 = create(:category)

      higher_stat_value = rand(100)
      lower_stat_value = higher_stat_value - rand(1..100)
      create(:week_metric, week: week, player: player_a, category: category, value: higher_stat_value)
      create(:week_metric, week: week, player: player_b, category: category, value: lower_stat_value)
      create(:week_metric, week: week, player: player_a, category: category2, value: lower_stat_value)
      create(:week_metric, week: week, player: player_b, category: category2, value: higher_stat_value)

      TeamCategoryRanking.calculate
      expect(TeamCategoryRanking.find_by(team: team_a, category: category).value).to eq(2)
      expect(TeamCategoryRanking.find_by(team: team_b, category: category).value).to eq(1)
      expect(TeamCategoryRanking.find_by(team: team_a, category: category2).value).to eq(1)
      expect(TeamCategoryRanking.find_by(team: team_b, category: category2).value).to eq(2)
    end

    context "with multiple players on a team" do
      let(:player_aa) { create(:player) }
      let(:player_bb) { create(:player) }

      before do
        @aa_player_state = create(:player_state, team: team_a, week: week, player: player_aa)
        create(:player_state, team: team_b, week: week, player: player_bb)
      end

      it "gives one point for each spot higher in the rankings" do
        player_a_stat = rand(100)
        player_aa_stat = rand(100)
        player_b_stat = rand(100)
        player_bb_stat = player_a_stat + player_aa_stat - player_b_stat - rand(1..100)
        create(:week_metric, week: week, player: player_a, category: category, value: player_a_stat)
        create(:week_metric, week: week, player: player_b, category: category, value: player_b_stat)
        create(:week_metric, week: week, player: player_aa, category: category, value: player_aa_stat)
        create(:week_metric, week: week, player: player_bb, category: category, value: player_bb_stat)

        TeamCategoryRanking.calculate
        expect(TeamCategoryRanking.find_by(team: team_a, category: category).value).to eq(2)
        expect(TeamCategoryRanking.find_by(team: team_b, category: category).value).to eq(1)
      end

      it "ignores players who were not active" do
        player_a_stat = rand(100)
        player_aa_stat = rand(100)
        player_b_stat = rand(100)
        player_bb_stat = player_a_stat + player_aa_stat - player_b_stat - rand(1..100)
        create(:week_metric, week: week, player: player_a, category: category, value: player_a_stat)
        create(:week_metric, week: week, player: player_b, category: category, value: player_b_stat)
        create(:week_metric, week: week, player: player_aa, category: category, value: player_aa_stat)
        create(:week_metric, week: week, player: player_bb, category: category, value: player_bb_stat)
        @aa_player_state.update(active: false)

        TeamCategoryRanking.calculate
        expect(TeamCategoryRanking.find_by(team: team_a, category: category).value).to eq(1)
        expect(TeamCategoryRanking.find_by(team: team_b, category: category).value).to eq(2)
      end
    end

    context "with multiple weeks" do
      let(:week2) { create(:week) }
      let(:category2) { create(:category) }

      it "gives one point for each spot higher in the rankings across multiple categories" do
        higher_stat_value = rand(100)
        lower_stat_value = higher_stat_value - rand(1..100)
        create(:week_metric, week: week, player: player_a, category: category, value: higher_stat_value)
        create(:week_metric, week: week, player: player_b, category: category, value: lower_stat_value)
        create(:week_metric, week: week, player: player_a, category: category2, value: lower_stat_value)
        create(:week_metric, week: week, player: player_b, category: category2, value: higher_stat_value)
        create(:week_metric, week: week2, player: player_a, category: category, value: lower_stat_value)
        create(:week_metric, week: week2, player: player_b, category: category, value: higher_stat_value + 1)
        create(:week_metric, week: week2, player: player_a, category: category2, value: higher_stat_value + 1)
        create(:week_metric, week: week2, player: player_b, category: category2, value: lower_stat_value)

        TeamCategoryRanking.calculate
        expect(TeamCategoryRanking.find_by(team: team_a, category: category).value).to eq(1)
        expect(TeamCategoryRanking.find_by(team: team_b, category: category).value).to eq(2)
        expect(TeamCategoryRanking.find_by(team: team_a, category: category2).value).to eq(2)
        expect(TeamCategoryRanking.find_by(team: team_b, category: category2).value).to eq(1)
      end
    end
  end
end
