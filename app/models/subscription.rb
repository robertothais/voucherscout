class Subscription
  include Mongoid::Document
  include Mongoid::Timestamps::Created

  field :email

  validates :email, uniqueness: true

end