class TeamCategoryRanking < ApplicationRecord
  belongs_to :team
  belongs_to :category

  def self.calculate
  end
end
