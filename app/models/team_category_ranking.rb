class TeamCategoryRanking < ApplicationRecord
  belongs_to :team
  belongs_to :category
end
