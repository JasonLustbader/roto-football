require "rails_helper"

RSpec.describe Category do
  describe "validations" do
    context "for name" do
      context "not present" do
        it "fails" do
          expect{ create(:category, name: nil) }.to raise_error(ActiveRecord::RecordInvalid)
        end
      end

      context "present" do
        it "succeeds" do
          create(:category)
        end
      end

      context "non-unique" do
        it "fails" do
          category1 = FactoryBot.create(:category)
          expect{ create(:category, name: category1.name) }.to raise_error(ActiveRecord::RecordInvalid)
        end
      end
    end
  end
end
