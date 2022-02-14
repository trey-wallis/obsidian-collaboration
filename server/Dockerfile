FROM node:17-alpine

WORKDIR /opt/node

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENTRYPOINT ["node"]

CMD ["index.js"]