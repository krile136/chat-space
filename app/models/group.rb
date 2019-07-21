class Group < ApplicationRecord
  has_many :group_users
  has_many :users, through: :group_users
  has_many :messages

  validates :name, presence: true, uniqueness: true

  def show_last_message
    if (last_message = messages.last).present?
      last_message.content? ? last_message.content : '画像が投稿されています'
      # 三項演算子 条件式 ? trueの時 : falseの時
      # 最後の投稿に文章があればそれを、なければ画像投稿された旨を表示
    else
      'まだメッセージはありません。'
    end
  end
end
