class TeamCategoryRanking < ApplicationRecord
  belongs_to :team
  belongs_to :category

  def self.calculate
    teams = Team.all
    categories = Category.all

    value = 0
    teams.sort_by { |t| t.id }.each do |team|
      categories.each do |category|
        TeamCategoryRanking.create!(team: team, category: category, value: value += 1)
      end
    end
  end
end
