FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get upgrade && \
    apt-get install npm -y

WORKDIR /home

RUN npm install --save express

ENTRYPOINT node app.js