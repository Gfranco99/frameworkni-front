# FROM node:14-alpine as build
# WORKDIR /app
# COPY package*.json /app/
# RUN npm install -g ionic@5.4.16
# RUN npm install
# COPY ./ /app/
# #RUN ionic build
# RUN ionic build --prod
# FROM nginx:alpine
# RUN rm -rf /usr/share/nginx/html/*
# COPY --from=build /app/www/ /usr/share/nginx/html/


FROM node:14-alpine as build
WORKDIR /app
COPY package.json /app/
RUN npm install -g @ionic/cli@7.2.1
RUN npm install
COPY ./ /app/
RUN npm rebuild esbuild
#RUN ionic build
RUN ionic build --prod
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/
COPY --from=build /app/www/ /usr/share/nginx/html/