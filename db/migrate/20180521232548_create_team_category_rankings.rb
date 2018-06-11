class CreateTeamCategoryRankings < ActiveRecord::Migration[5.2]
  def change
    create_table :team_category_rankings do |t|
      t.references :team, foreign_key: true
      t.references :category, foreign_key: true
      t.float :value

      t.timestamps
    end
  end
end
