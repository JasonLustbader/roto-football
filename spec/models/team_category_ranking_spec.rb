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
end
