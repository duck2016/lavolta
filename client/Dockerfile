FROM node:slim

# dependencies
RUN mkdir -p /usr/src
WORKDIR /usr/src
COPY package.json .
COPY package-lock.json .
RUN npm install -g webpack --production --quiet --no-optional
RUN npm install -g pm2 --production --quiet --no-optional
RUN npm install --production --quiet --no-optional

# bundle source
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

# test & lint
#RUN npm run installdev
#RUN npm run lint
#RUN npm run test

EXPOSE 3000
CMD npm start