class Poisson::Dispatcher

  attr_accessor :rate

  # Per second
  def initialize(rate, &blk)
    @rate = rate
    @blk = blk
  end

  def start
    loop do
      sleep(-Math.log(1.0 - Random.rand) / @rate)
      @blk.call(self)
    end
  end
end