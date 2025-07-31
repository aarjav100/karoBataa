#!/bin/bash

# Deployment Script for Web Chat App
echo "🚀 Starting deployment process..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Firebase credentials."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the application
echo "🔨 Building the application..."
pnpm build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your app is ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    echo "   git push"
    echo ""
    echo "2. Deploy to Vercel (Recommended):"
    echo "   - Go to https://vercel.com"
    echo "   - Import your GitHub repository"
    echo "   - Add environment variables from your .env file"
    echo "   - Deploy!"
    echo ""
    echo "3. Or deploy to Netlify:"
    echo "   - Go to https://netlify.com"
    echo "   - Drag and drop the 'dist' folder"
    echo ""
    echo "📁 Your built files are in the 'dist' folder"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi 