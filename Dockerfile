FROM node:18-alpine

WORKDIR /src

# Copy package files first (to optimize Docker layer caching)
COPY package*.json ./

# Install dependencies (including TypeScript)
RUN npm install && npm install -g typescript

# Copy all project files
COPY . .

# Copy environment variables
COPY .env .env

# Build TypeScript project
RUN npm run build

# Expose the correct port
EXPOSE 4000

# Run the server
CMD ["node", "dist/server.js"]
