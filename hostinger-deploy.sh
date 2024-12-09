#!/bin/bash

# Build the frontend
npm run build

# Create necessary directories if they don't exist
ssh username@hostname "mkdir -p ~/nodejs"
ssh username@hostname "mkdir -p ~/nodejs/server"

# Clear existing public_html contents
ssh username@hostname "rm -rf ~/public_html/*"

# Upload frontend build to public_html
scp -r ./dist/* username@hostname:~/public_html/

# Upload server files to nodejs directory
scp -r ./server/* username@hostname:~/nodejs/server/
scp package.json username@hostname:~/nodejs/
scp package-lock.json username@hostname:~/nodejs/

# SSH into the server and set up Node.js application
ssh username@hostname "cd ~/nodejs && \
    npm install --production && \
    # Update .env file with production values
    echo 'PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
DB_TIMEZONE=+00:00
DB_CONNECTION_LIMIT=10
DB_WAIT_FOR_CONNECTIONS=true
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=$JWT_SECRET' > ./server/.env && \
    # Set up PM2 if not already installed
    npm install pm2 -g && \
    # Start/Restart the application
    pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js"
