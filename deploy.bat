@echo off
REM 🚀 Finance Calculator Deployment Script for Windows
REM This script helps deploy your finance calculator to production

echo 🚀 Starting Finance Calculator Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the financecalc directory
    pause
    exit /b 1
)

REM Build the project
echo 📦 Building project...
call npm run build -- --no-lint

if %errorlevel% equ 0 (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed!
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% equ 0 (
    echo 🌐 Vercel CLI found. Deploying to Vercel...
    vercel --prod
) else (
    REM Check if Netlify CLI is installed
    where netlify >nul 2>nul
    if %errorlevel% equ 0 (
        echo 🌐 Netlify CLI found. Deploying to Netlify...
        netlify deploy --prod --dir=.next
    ) else (
        echo 📋 Manual deployment required.
        echo.
        echo Available deployment options:
        echo 1. Vercel: npm install -g vercel ^&^& vercel
        echo 2. Netlify: npm install -g netlify-cli ^&^& netlify deploy --prod --dir=.next
        echo 3. Railway: Connect GitHub repo and set build command: npm run build
        echo 4. DigitalOcean: Connect repo and set build command: npm run build
        echo.
        echo Your build is ready in the .next directory!
    )
)

echo 🎉 Deployment script completed!
pause 