# Use an official Node.js runtime as the base image
FROM node:16

# Install necessary libraries
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  apt-transport-https \
  && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Specify environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

# Expose the port the app runs on
EXPOSE 10000

# Run the app
CMD [ "node", "index.js" ]
