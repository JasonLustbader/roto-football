require 'rails_helper'

RSpec.describe WeekMetric, type: :model do
  it "creates" do
    create(:week_metric)
  end

  it "doesn't create when week is nil" do
    expect{ create(:week_metric, week: nil) }.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "doesn't create when player is nil" do
    expect{ create(:week_metric, player: nil) }.to raise_error(ActiveRecord::RecordInvalid)
  end

  it "doesn't create when category is nil" do
    expect{ create(:week_metric, category: nil) }.to raise_error(ActiveRecord::RecordInvalid)
  end
end
