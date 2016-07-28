namespace :events do
  desc 'Synchronize events continously'
  task :synchronize => :environment do
    unless ENV['EVENT_SYNCHRONIZE_FREQUENCY_PER_MINUTE'].present?
      raise ArgumentError, 'Specify a feed update frequency'
    end
    rate = ENV['EVENT_SYNCHRONIZE_FREQUENCY_PER_MINUTE']
    puts 'Starting event synchronizer'
    begin
      EventSynchronizer.new(rate).start
    rescue Interrupt
      exit
    rescue SignalException => e
      puts "Received #{e}. Exiting."
      exit
    end
  end
end