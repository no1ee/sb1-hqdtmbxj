#!/bin/bash

# Clean up previous build
rm -rf public_html
rm -rf dist

# Build the frontend
npm run build

# Create public_html directory
mkdir public_html

# Move built files to public_html
mv dist/* public_html/

# Clean up
rm -rf dist

echo "Build complete! Repository is ready for Hostinger deployment."
