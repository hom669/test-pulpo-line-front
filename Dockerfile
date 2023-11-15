FROM node:18.17.1 as build
WORKDIR /app
COPY package*.json .
RUN yarn install
COPY . .
RUN npm install -g npm@10.2.3
RUN npm run build

FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
