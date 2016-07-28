FROM ruby:2.3.1
RUN apt-get update -qq
RUN apt-get install -y build-essential libxml2-dev libxslt1-dev nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD Gemfile* /tmp/
ADD package.json /tmp/
RUN gem install bundler

WORKDIR /tmp
RUN npm install
RUN bundle install --without test development

ENV APP_HOME /voucherscout
RUN mkdir $APP_HOME

RUN cp -a /tmp/node_modules $APP_HOME

WORKDIR $APP_HOME
ADD . $APP_HOME

RUN export $(cat .env.docker | xargs) && bundle exec rake assets:precompile