#!/bin/bash

# Create project directory
mkdir -p ~/patient-announcement-system
cd ~/patient-announcement-system

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Copy server files
cp -r ../server/* .

# Install dependencies
npm install

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Run database setup
node setup-db.js

# Start the application using PM2
pm2 start ecosystem.config.js

# Save PM2 process list and configure to start on system boot
pm2 save
pm2 startup
