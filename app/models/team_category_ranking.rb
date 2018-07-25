class TeamCategoryRanking < ApplicationRecord
  belongs_to :team
  belongs_to :category

  def self.calculate
    week_metrics = WeekMetric.joins("INNER JOIN player_states ON (player_states.player_id = week_metrics.player_id)").where("player_states.active = ?", true).group(:team_id, :category_id).sum(:value)
    sorted_team_aggregates = week_metrics.to_a.sort_by{ |_, value| value }

    tied_scores = Hash.new()
    tied_team_buffers = Hash.new{ |h, k| h[k] = [] }
    rankings = Hash.new(0)

    sorted_team_aggregates.each do |team_aggregate|
      team_id = team_aggregate.first.first
      category_id = team_aggregate.first.last
      value = team_aggregate.last

      if tied_team_buffers[category_id].empty?
        tied_team_buffers[category_id] << team_id
        tied_scores[category_id] = value
      elsif tied_scores[category_id] == value
        tied_team_buffers[category_id] << team_id
      else
        score = self.calculate_value_for_rank(rankings[category_id], tied_team_buffers[category_id].size)
        tied_team_buffers[category_id].each do |team|
          TeamCategoryRanking.create!(team_id: team, category_id: category_id, value: score)
        end
        tied_team_buffers[category_id] = [team_id]
      end

      rankings[category_id] += 1
    end

    tied_team_buffers.each do |category_id, buffer|
      next if buffer.empty?
      score = self.calculate_value_for_rank(rankings[category_id], buffer.size)
      buffer.each do |team|
        TeamCategoryRanking.create!(team_id: team, category_id: category_id, value: score)
      end
    end
  end

  def self.calculate_value_for_rank(rank, tied_team_count)
    return rank if tied_team_count == 1

    1 + (rank - tied_team_count) + 1.0 * (tied_team_count - 1) / tied_team_count;
  end
end
