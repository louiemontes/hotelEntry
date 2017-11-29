FROM node:8

WORKDIR /hotelEntry

COPY package.json /hotelEntry

RUN npm install

COPY . /hotelEntry

CMD npm start

EXPOSE 8081
