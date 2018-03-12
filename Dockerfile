FROM debian:jessie
RUN apt-get update

RUN apt-get -y install \
  wget \
  xz-utils

WORKDIR /usr/local

RUN wget -q https://nodejs.org/dist/v9.8.0/node-v9.8.0-linux-x64.tar.xz && tar xf node-v9.8.0-linux-x64.tar.xz && rm node-v9.8.0-linux-x64.tar.xz

ENV PATH=/usr/local/node-v9.8.0-linux-x64/bin:$PATH

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN mkdir -p /opt/app

WORKDIR /opt/app
