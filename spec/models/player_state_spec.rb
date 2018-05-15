require 'rails_helper'

RSpec.describe PlayerState, type: :model do
  let(:player_state) { FactoryBot.create(:player_state, week_id: week_id) }

  describe "week id validation" do
    context "with a valid week id" do
      it "doesn't save" do
      end
    end

    context "with an invalid week id" do
      it "saves" do
      end
    end
  end
end
