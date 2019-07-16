class Message < ApplicationRecord
  belongs_to :group
  belongs_to :user

  validates :content, presence: true, unless: :image?
  # imageがないときに、contentが存在していないと保存できない
  # 逆に、imageがあるときはcontentの有無によらず保存される
end
