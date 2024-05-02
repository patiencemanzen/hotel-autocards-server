# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
COPY . /app

# Install global dependencies
RUN npm install -g typescript ts-node

# Install project dependencies
RUN npm install

# Compile TypeScript to JavaScript
RUN npm run build

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Run the compiled JS when the container launches
CMD ["node", "build/src/index.js"]