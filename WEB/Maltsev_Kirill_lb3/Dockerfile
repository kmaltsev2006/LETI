FROM node:18-slim

WORKDIR /home

COPY ./lab3.com/package.json ./
RUN npm install

COPY ./lab3.com ./

RUN npm run build

CMD ["node", "server.js"]