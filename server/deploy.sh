#!/bin/bash

# Install dependencies
npm install

# Setup the database
node setup-db.js

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Start the application using PM2
pm2 start ecosystem.config.js

# Save PM2 process list and configure to start on system boot
pm2 save
pm2 startup
