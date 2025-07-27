#!/bin/bash

# 🚀 Finance Calculator Deployment Script
# This script helps deploy your finance calculator to production

echo "🚀 Starting Finance Calculator Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the financecalc directory"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build -- --no-lint

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🌐 Vercel CLI found. Deploying to Vercel..."
    vercel --prod
elif command -v netlify &> /dev/null; then
    echo "🌐 Netlify CLI found. Deploying to Netlify..."
    netlify deploy --prod --dir=.next
else
    echo "📋 Manual deployment required."
    echo ""
    echo "Available deployment options:"
    echo "1. Vercel: npm install -g vercel && vercel"
    echo "2. Netlify: npm install -g netlify-cli && netlify deploy --prod --dir=.next"
    echo "3. Railway: Connect GitHub repo and set build command: npm run build"
    echo "4. DigitalOcean: Connect repo and set build command: npm run build"
    echo ""
    echo "Your build is ready in the .next directory!"
fi

echo "🎉 Deployment script completed!" 