require "rails_helper"

RSpec.describe Team do
  describe "validations" do
    context "for name" do
      context "not present" do
        it "fails" do
          team = FactoryBot.build(:team, name: nil)
          expect(team.valid?).to be false
        end
      end

      context "present" do
        it "succeeds" do
          team = FactoryBot.build(:team)
          expect(team.valid?).to be true
        end
      end

      context "non-unique" do
        it "fails" do
          team1 = FactoryBot.create(:team)
          team2 = FactoryBot.build(:team, name: team1.name)
          expect(team2.valid?).to be false
        end
      end
    end
  end
end
