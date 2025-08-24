# Stage 1: Build the Angular app
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Pass configuration as a build argument
ARG CONFIGURATION
RUN npm run build -- --configuration=$CONFIGURATION

# Stage 2: Serve the Angular app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
