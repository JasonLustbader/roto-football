FROM debian:jessie

RUN apt-get update
RUN apt-get -y install \
  nodejs \
  npm
