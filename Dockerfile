# 1. Base Image: Use an official Node.js runtime
FROM node:18-alpine

# 2. Set working directory inside the container
WORKDIR /app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the application code
COPY . .

# 5. Expose the port the app runs on
EXPOSE 3000

# 6. Command to run the application
CMD ["node", "server.js"]