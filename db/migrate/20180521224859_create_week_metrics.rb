class CreateWeekMetrics < ActiveRecord::Migration[5.2]
  def change
    create_table :week_metrics do |t|
      t.references :week, foreign_key: true
      t.references :player, foreign_key: true
      t.references :category, foreign_key: true
      t.integer :value

      t.timestamps
    end
  end
end
