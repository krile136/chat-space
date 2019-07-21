FactoryBot.define do

  factory :message do
    content {Faker::Lorem.sentence}
    image {File.open("#{Rails.root}/public/images/test_image.jpg")}
    user
    group
    created_at { Faker::Time.between(2.days.ago, Time.now, :all) }
  end

end