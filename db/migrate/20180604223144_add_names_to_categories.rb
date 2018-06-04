class AddNamesToCategories < ActiveRecord::Migration[5.2]
  def change
    change_table :categories do |t|
      t.string :name
    end
  end
end
