FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN set -ex; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
    mysql-client \
    systemd \
    redis-server

RUN systemctl enable redis-server.service    

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]