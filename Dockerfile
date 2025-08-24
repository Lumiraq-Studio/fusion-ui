# Stage 1: Build Angular app
FROM node:lts-alpine AS build-step

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG CONFIGURATION
RUN npm run build -- --configuration=$CONFIGURATION

# Stage 2: Serve app
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/dist/fusion-erp-ui/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
