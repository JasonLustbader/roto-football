class TeamCategoryRanking < ApplicationRecord
  belongs_to :team
  belongs_to :category

  def self.calculate
    week_metrics = WeekMetric.joins("INNER JOIN player_states ON player_states.player_id = week_metrics.player_id").group(:team_id, :category_id).sum(:value)
    sorted_team_aggregates = week_metrics.to_a.sort_by{ |team_id, value| value }
    category_id = sorted_team_aggregates.first.first.last if week_metrics.present?

    tied_score = nil
    tied_team_buffer = []
    ranking = 0

    sorted_team_aggregates.each do |team_aggregate|
      team_id = team_aggregate.first.first
      value = team_aggregate.last

      if tied_team_buffer.empty?
        tied_team_buffer << team_id
        tied_score = value
      elsif tied_score == value
        tied_team_buffer << team_id
      else
        score = self.calculate_value_for_rank(ranking, tied_team_buffer.size)
        tied_team_buffer.each do |team|
          TeamCategoryRanking.create!(team_id: team, category_id: category_id, value: score)
        end
        tied_team_buffer = [team_id]
      end

      ranking += 1
    end

    unless tied_team_buffer.empty?
      score = self.calculate_value_for_rank(ranking, tied_team_buffer.size)
      tied_team_buffer.each do |team|
        TeamCategoryRanking.create!(team_id: team, category_id: category_id, value: score)
      end
    end
  end

  def self.calculate_value_for_rank(rank, tied_team_count)
    return rank if tied_team_count == 1

    1 + (rank - tied_team_count) + 1.0 * (tied_team_count - 1) / tied_team_count;
  end
end
