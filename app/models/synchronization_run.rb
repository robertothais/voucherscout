class SynchronizationRun
  include Mongoid::Document
  include Mongoid::Timestamps::Created

  field :new_events, type: Integer
  field :existing_events, type: Integer
  field :success, type: Boolean
  field :error
  field :ip

  def self.latest
    SynchronizationRun.where(success: true).order('created_at' => 'desc').first
  end

end