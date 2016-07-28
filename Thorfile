require 'dotenv'
require 'uri'

class Docker < Thor
  include Thor::Actions
  package_name 'Docker'

  DOCKER_MACHINE_NAME = 'augusta'
  WEB_CONTAINERS = 1

  desc 'env', 'Sets the docker environment'
  def env
    Dotenv::Parser.call(run("docker-machine env #{ENV['MACHINE'] || DOCKER_MACHINE_NAME}", capture: true)).each { |k,v| ENV[k] = v}
  end

  desc 'build', 'Builds the docker containers'
  def build
    invoke :env
    run('docker-compose build')
  end

  desc 'ps', 'Shows running processes'
  def ps
    invoke :env
    run('docker-compose ps')
  end

  desc 'deploy', 'Builds and deploys the application'
  def deploy
    if invoke :build
      invoke :up
    else
      error 'Could not re-build containers'
    end
    invoke :clean
  end

  desc 'up', 'Starts docker containers'
  def up
    invoke :env
    run('docker-compose up -d --remove-orphans')
    invoke :scale, [ WEB_CONTAINERS ]
  end

  desc 'down', 'Stops docker containers'
  def down
    invoke :env
    run('docker-compose down')
  end

  desc 'exec', 'Runs a one-off command'
  def exec(*command)
    invoke :env, []
    run("docker-compose run --rm web #{command.join(' ')}")
  end

  desc 'console', 'Runs a Rails console in the container'
  def console
    invoke :exec, ['bundle', 'exec', './bin/rails', 'console']
  end

  desc 'scale', 'Scales the web service to the number of containers specified'
  def scale(i)
    invoke :env, []
    run("docker-compose scale web=#{i}")
  end

  desc 'clean', 'Removes stopped containers and dangling images.'
  def clean
    invoke :env
    run('docker ps -a -q -f status=exited | xargs docker rm')
    run('docker images -a -f "dangling=true" -q | xargs docker rmi')
    # THIS WILL REMOVE MONGO AND REDIS VOLUMES IF THEIR CONTAINERS ARE STOPPED
    # TODO BLACKLIST THOSE VOLUMES
    # run('docker volume ls -qf "dangling=true" | xargs docker volume rm')
  end

  desc 'ssh', 'SSH into the docker host'
  def ssh
    invoke :env
    run("ssh root@#{URI.parse(ENV['DOCKER_HOST']).host}")
  end

  desc 'explore', 'Gets bash shell in a running container, defaults to web'
  def explore(container = 'web')
    invoke :env, []
    run("docker-compose exec #{container} /bin/bash")
  end

end