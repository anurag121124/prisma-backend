FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json first for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Copy the .env file (ensure it's included only in builds)
COPY .env .env

# Build the TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "dist/server.js"]

