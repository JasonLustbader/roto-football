FROM debian:jessie
RUN apt-get update
RUN apt-get -y install \
  nodejs \
  npm

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN ./node_modules/.bin/jasmine init
