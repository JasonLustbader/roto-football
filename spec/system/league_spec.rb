require "rails_helper"

RSpec.describe "visiting /league page", type: :system do
  before do
    driven_by :selenium, using: :headless_chrome
  end

  it "can go to the league page" do
    visit '/league'
  end
end
