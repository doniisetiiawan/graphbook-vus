FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 8000
CMD [ "npm", "run", "server" ]
