# Use official Node.js LTS image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port that Express listens on
EXPOSE 8080

# Start the application
CMD ["node", "dist/server.js"]
