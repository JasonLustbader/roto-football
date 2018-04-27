FROM debian:9.4

# Base/ruby dependencies
RUN apt-get update && apt-get -y install \
  gcc \
  libssl-dev \
  make \
  wget \
  zlib1g-dev

RUN wget https://cache.ruby-lang.org/pub/ruby/2.5/ruby-2.5.0.tar.gz && tar xzvf ruby-2.5.0.tar.gz && cd ruby-2.5.0 && ./configure && make install

RUN gem install bundler

ARG uid
RUN useradd -m -u ${uid:-1000} appuser

ENV BUNDLE_PATH=/opt/app/vendor/bundle
ENV BUNDLE_APP_CONFIG=$BUNDLE_PATH
RUN mkdir -p $BUNDLE_APP_CONFIG
COPY Gemfile* /tmp/
WORKDIR /tmp

# Rails/gem dependencies
RUN apt-get -y install \
  libsqlite3-dev

RUN bundle install

RUN mkdir -p /opt/app
COPY . /opt/app
WORKDIR /opt/app
RUN chown -R appuser:appuser .

# Selenium dependencies

RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list

RUN apt-get -y install \
  gnupg

RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -

RUN apt-get update && apt-get -y install \
  google-chrome-stable \
  libnss3

USER appuser
