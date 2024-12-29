# Stage 1: Build
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Copy Prisma schema directory
COPY prisma ./prisma/

# Generate Prisma client

# Build TypeScript files
RUN npm run build

# Stage 2: Run
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm install --production
RUN npx prisma generate



# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Copy the .env file containing environment variables
COPY .env .env

# Expose port 4000 (you can change this if needed)
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
