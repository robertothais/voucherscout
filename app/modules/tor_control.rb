module TorControl
  def self.rotate
    uri = URI.parse(ENV['TOR_SOCKS_PROXY'])
    Tor::Controller.connect(host: uri.host, port: ENV['TOR_CONTROL_PORT'], cookie: ENV['TOR_CONTROL_PASSWORD']) do |tor|
      puts 'Sending newnym signal to Tor process. Rotating.'
      tor.signal('newnym')
    end
  end
end
