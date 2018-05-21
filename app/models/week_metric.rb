class WeekMetric < ApplicationRecord
  belongs_to :week
  belongs_to :player
  belongs_to :category
end
