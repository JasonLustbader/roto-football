class TeamCategoryRanking < ApplicationRecord
  belongs_to :team
  belongs_to :category

  def self.calculate
    week_metrics = WeekMetric.order(:value)
    category = week_metrics.first.category if week_metrics.present?

    tied_score = nil
    tied_team_buffer = []
    ranking = 0

    week_metrics.each do |week_metric|
      if tied_team_buffer.empty?
        tied_team_buffer << week_metric.team
        tied_score = week_metric.value
      elsif tied_score == week_metric.value
        tied_team_buffer << week_metric.team
      else
        score = self.calculate_value_for_rank(ranking, tied_team_buffer.size)
        tied_team_buffer.each do |team|
          TeamCategoryRanking.create!(team: team, category: category, value: score)
        end
        tied_team_buffer = [week_metric.team]
      end

      ranking += 1
    end

    unless tied_team_buffer.empty?
      score = self.calculate_value_for_rank(ranking, tied_team_buffer.size)
      tied_team_buffer.each do |team|
        TeamCategoryRanking.create!(team: team, category: category, value: score)
      end
    end
  end

  def self.calculate_value_for_rank(rank, tied_team_count)
    return rank if tied_team_count == 1

    1 + (rank - tied_team_count) + 1.0 * (tied_team_count - 1) / tied_team_count;
  end
end
