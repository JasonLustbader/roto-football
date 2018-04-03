require "system_spec_helper"

describe "league display" do
  it "can visit the page" do
    visit "/league"

    expect(page).to have_content('League')
  end
end
