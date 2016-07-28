require 'json'

class Parser
  attr_reader :data

  def initialize(data)
    @data = Hashie::Mash.new(JSON.parse(data))
    @response = @data.response
  end

  def count
    @response.numFound
  end

  def normalized_events
    @response.docs.map { |e| NormalizedEvent.new(e) }
  end

  class NormalizedEvent

    def initialize(data)
      @data = data
    end

    def name
      CGI.unescapeHTML(@data.EventName)
    end

    def venue_name
      CGI.unescapeHTML(@data.VenueName)
    end

    def venue_city
      @data.VenueCity
    end

    def venue_state
      @data.VenueState
    end

    def venue_address
      CGI.unescapeHTML(@data.VenueAddress)
    end

    def genre
      CGI.unescapeHTML(@data.MinorGenre.first)
    end

    def coordinates
      @data.VenueLatLong.split(',').map(&:to_f)
    end

    def event_id
      @data.EventId
    end

    def suspended
      @data.SchlesingerSuspended
    end

    def elegible
      @data.SchlesingerEligible
    end

    def time
      @data.EventDate.to_time
    end

    def timezone
      @data.Timezone
    end

    def artists
      out = @data.AttractionName.select { |a| a.present? }
      if out.length > 1 && out.last == @data.EventName
        out.pop
      end
      out.map { |a| CGI.unescapeHTML(a) }
    end

    def event_exists?
      Event.where(event_id: event_id).exists?
    end

    def existing_event
      Event.where(event_id: event_id).first
    end

    def to_event
      Event.new.tap do |event|
        Event.fields.keys.each do |attr|
          if respond_to?(attr)
            event.send("#{attr}=", send(attr))
          end
        end
      end
    end
  end
end
