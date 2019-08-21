FROM node:10 AS build
WORKDIR /usr/src/app
COPY .babelrc ./
COPY package*.json ./
COPY webpack.server.build.config.js ./
COPY webpack.client.build.config.js ./
COPY src src
RUN npm install
ENV NODE_ENV production
ENV JWT_SECRET YOUR_SECRET
ENV username YOUR_USERNAME
ENV password YOUR_PASSWORD
ENV database YOUR_DATABASE
ENV host YOUR_HOST
RUN npm install -g mysql2 sequelize sequelize-cli
RUN sequelize db:migrate --migrations-path src/server/migrations --config src/server/config/index.js --env production
RUN npm run test
RUN npm run build
FROM node:10
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json package.json
COPY --from=build /usr/src/app/dist dist
RUN npm install --only=production
EXPOSE 8000
CMD [ "npm", "run", "server:production" ]
