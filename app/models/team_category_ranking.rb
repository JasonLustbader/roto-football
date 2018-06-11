class TeamCategoryRanking < ApplicationRecord
  belongs_to :team
  belongs_to :category

  def self.calculate
    week_metrics = WeekMetric.order(:value)
    week = Week.first

    ranking = 1

    week_metrics.each do |week_metric|
      team = PlayerState.where(player: week_metric.player, week: week).first.team

      TeamCategoryRanking.create!(team: team, category: week_metric.category, value: ranking)
      ranking += 1
    end
  end
end
