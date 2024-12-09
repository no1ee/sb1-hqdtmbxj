#!/bin/bash

# Clone the repository in the home directory
cd ~
git clone https://github.com/your-username/sb1-analysis.git temp-repo

# Create symbolic link for public_html
rm -rf ~/public_html
ln -s ~/temp-repo/public_html ~/public_html

# Install dependencies for backend
cd ~/temp-repo
npm install --production

# Set up environment variables
cd ~/temp-repo
cp .env.example .env
# You'll need to manually edit .env with your production values

# Install PM2 globally if not installed
npm install -g pm2

# Initialize database
cd ~/temp-repo
node setup-db.js

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Set up PM2 to start on system boot
pm2 startup
