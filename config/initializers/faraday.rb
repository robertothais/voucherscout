require "socksify"
require 'socksify/http'

class Faraday::Adapter::NetHttp
  def net_http_connection(env)
    if proxy = env[:request][:proxy]
      if proxy[:uri].scheme == 'socks5'
        Net::HTTP::SOCKSProxy(proxy[:uri].host, proxy[:uri].port)
      else
        Net::HTTP::Proxy(proxy[:uri].host, proxy[:uri].port, proxy[:user], proxy[:password])
      end
    else
      Net::HTTP
    end.new(env[:url].host, env[:url].port || (env[:url].scheme == 'https' ? 443 : 80))
  end
end