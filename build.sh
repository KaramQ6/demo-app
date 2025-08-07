#!/bin/bash
# Post-build script for DigitalOcean deployment

echo "Installing frontend dependencies..."
cd frontend && npm ci --production=false

echo "Building frontend application..."
npm run build

echo "Build completed successfully!"
ls -la build/
