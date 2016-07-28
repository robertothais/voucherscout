# Check this script for sold out shows
# http://b.monetate.net/img/1/735/644041.js (outdated)
# http://b.monetate.net/img/1/735/645514.js
# http://b.monetate.net/img/1/735/645516.js
# JSON.parse(Faraday.new('http://b.monetate.net/img/1/735/645514.js').get.body.match(/\[\".+\]/).to_s)

class EventSynchronizer

  DATA_SOURCES = [
    "http://concerts.livenation.com/json/search/microsite/event/local?site_tmpl=STYLE_C&page_id=721",
    "http://concerts.livenation.com/json/search/microsite/event/national?site_tmpl=STYLE_C&page_id=721",
    "http://concerts.livenation.com/json/search/microsite/event/domain?site_tmpl=STYLE_C&page_id=721"
  ]

  def initialize(effective_rate)
    @rate = effective_rate.to_f / 60.to_f
  end

  def start
    dispatcher = Poisson::Dispatcher.new(@rate) do |d|
      puts "Synchronizing..."
      begin
        synchronize!
        puts "Done"
      rescue => e
        puts "#{e.class.name}: #{e.message} #{e.backtrace.join("\n")}"
        Raven.capture_exception(e)
      ensure
        TorControl.rotate
      end
    end
    dispatcher.start
  end

  def synchronize!
    run = SynchronizationRun.new
    faraday_config = lambda { |conn|
      conn.adapter :net_http
      conn.use Faraday::Response::RaiseError
      conn.proxy ENV['TOR_SOCKS_PROXY']
    }
    run.ip = Faraday.new('http://ipecho.net/plain', &faraday_config).get.body
    begin
      data = EventSynchronizer::DATA_SOURCES.map do |url|
        conn = Faraday.new(url, &faraday_config)
        response = conn.get
        response.body
      end
    rescue => e
      run.success = false
      run.error = "#{e.class.name}: #{e.message}"
      run.save!
      raise e
    end
    new_events = 0
    existing_events = 0
    data.each do |d|
      parser = Parser.new(d)
      parser.normalized_events.each do |normalized_event|
        begin
          if normalized_event.event_exists?
            existing_events += 1
            normalized_event.existing_event.update!({
              last_seen: Time.now,
              suspended: normalized_event.suspended,
              elegible: normalized_event.elegible
            })
          else
            new_events += 1
            event = normalized_event.to_event
            event.save!
          end
        rescue => e
          puts "Could not handle event #{normalized_event}: #{e.inspect}"
          Raven.capture_exception(e)
        end
      end
    end
    run.new_events = new_events
    run.success = true
    run.existing_events = existing_events
    run.save!
  end

end