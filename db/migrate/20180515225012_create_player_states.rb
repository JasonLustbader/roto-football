class CreatePlayerStates < ActiveRecord::Migration[5.2]
  def change
    create_table :player_states do |t|
      t.references :team, foreign_key: true
      t.references :week, foreign_key: true
      t.references :player, foreign_key: true
      t.boolean :active

      t.timestamps
    end
  end
end
