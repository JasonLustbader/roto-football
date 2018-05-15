class PlayerState < ApplicationRecord
  belongs_to :team
  belongs_to :player
  belongs_to :week
end
