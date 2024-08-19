@echo off

:: Command 1: Install Node.js via winget and set environment variables
echo Installing Node.js...
winget install OpenJS.NodeJS
if %errorlevel% neq 0 (
    echo Failed to install Node.js. Exiting...
    exit /b %errorlevel%
)

:: Manually refresh the environment variables
set "NODE_PATH=%ProgramFiles%\nodejs"
set PATH=%NODE_PATH%;%PATH%

:: Pause to ensure the installation is complete
echo Node.js installation complete. Press any key to continue...
pause

:: Command 2: Run npm install
echo Running npm install...
start cmd /c "shicmo.bat"
if %errorlevel% neq 0 (
    echo npm install failed. Exiting...
    exit /b %errorlevel%
)

echo All commands executed successfully.

:: Automatically execute shicmo.bat script
echo Running shicmo.bat...
npm i
if %errorlevel% neq 0 (
    echo shicmo.bat execution failed. Exiting...
    exit /b %errorlevel%
)

echo All tasks completed successfully.
pause
