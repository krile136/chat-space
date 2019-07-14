class CangeColumnToGroup < ActiveRecord::Migration[5.0]
  def up
    change_column :groups, :name,:string, null: false, index: true
  end
    
  def down
    change_column :groups, :name,:string, null: false
  end
end
