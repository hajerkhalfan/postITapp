# Stage 1: Build the React application
FROM node:lts AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install 

# Copy the entire application and build it
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
