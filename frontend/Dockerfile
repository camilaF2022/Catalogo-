# Use the official Node.js image from the Docker Hub
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json files into the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the React app
RUN npm run build

# Set the default command to run the frontend application
CMD ["npm", "start"]