class Event
  include Mongoid::Document
  include Mongoid::Timestamps::Created

  field :name
  field :venue_name
  field :venue_city
  field :venue_state
  field :venue_address
  field :genre
  field :coordinates, type: Array
  field :event_id
  field :time, type: DateTime
  field :artists
  field :timezone
  field :suspended, type: Boolean
  field :popularity, type: Integer
  field :sold_out, type: Boolean, default: false
  field :elegible, type: Boolean
  field :last_seen, type: Time

  validates :event_id, uniqueness: true
  index({ event_id: 1 }, unique: true)

  before_create do
    self.last_seen = Time.now
    set_popularity
  end

  def self.active
    where(:time.gte => Time.now)
      .where(:last_seen.gte => 6.hours.ago)
      .where(sold_out: false)
      .where(suspended: false)
      .order_by(time: 'asc')
  end

  def serializable_hash(_options = nil)
    super(except: %i[_id created_at updated_at venue_address timezone time last_seen]).merge(
      time: time.in_time_zone(timezone)
    )
  end

  def spotify_artists
    @spotify_artists ||= artists.map { |a| RSpotify::Artist.search(a).first }.compact
  end

  def spotify_popularity
    @spotify_popularity ||= begin
      if spotify_artists.any?
        spotify_artists.sum(&:popularity) / spotify_artists.length.to_f
      end
    end
  end

  def set_popularity
    self.popularity = spotify_popularity
  end
end
