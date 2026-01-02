@echo off
REM Restart Development Server Script (Windows)
REM This properly clears cache and restarts with fresh environment variables

echo Cleaning React cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist build rmdir /s /q build

echo Cache cleared!
echo.
echo Starting development server...
echo Environment variables will be loaded from .env file
echo.

npm start
