#!/bin/bash
# Restart Development Server Script
# This properly clears cache and restarts with fresh environment variables

echo "🧹 Cleaning React cache..."
rm -rf node_modules/.cache
rm -rf build

echo "✅ Cache cleared!"
echo ""
echo "🔄 Starting development server..."
echo "Environment variables will be loaded from .env file"
echo ""

npm start
