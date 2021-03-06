require "rails_helper"

RSpec.describe Team do
  describe "validations" do
    context "for name" do
      context "not present" do
        it "fails" do
          expect{ create(:team, name: nil) }.to raise_error(ActiveRecord::RecordInvalid)
        end
      end

      context "present" do
        it "succeeds" do
          create(:team)
        end
      end

      context "non-unique" do
        it "fails" do
          team1 = FactoryBot.create(:team)
          expect{ create(:team, name: team1.name) }.to raise_error(ActiveRecord::RecordInvalid)
        end
      end
    end
  end
end
