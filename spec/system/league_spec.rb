require "rails_helper"

RSpec.describe "visiting /league page", type: :system do
  it "can go to the league page" do
    visit '/league'
  end
end
