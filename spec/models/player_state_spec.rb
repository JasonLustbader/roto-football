require 'rails_helper'

RSpec.describe PlayerState, type: :model do
  describe "validations" do
    it "passes by default" do
      player_state = FactoryBot.build(:player_state)
      expect(player_state.valid?).to be true
    end

    context "for team" do
      context "not present" do
        it "fails" do
          player_state = FactoryBot.build(:player_state, team: nil)
          expect(player_state.valid?).to be false
        end
      end
    end

    context "for player" do
      context "not present" do
        it "fails" do
          player_state = FactoryBot.build(:player_state, player: nil)
          expect(player_state.valid?).to be false
        end
      end
    end

    context "for week" do
      context "not present" do
        it "fails" do
          player_state = FactoryBot.build(:player_state, week: nil)
          expect(player_state.valid?).to be false
        end
      end
    end
  end
end
