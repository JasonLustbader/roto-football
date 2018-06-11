class WeekMetric < ApplicationRecord
  belongs_to :week
  belongs_to :player
  belongs_to :category

  def team
    PlayerState.find_by(player: player, week: week).team
  end
end
