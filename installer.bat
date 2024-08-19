@echo off

:: Command 1: Install Node.js via winget and set environment variables
echo Installing Node.js to use Wi-File...
winget install OpenJS.NodeJS
if %errorlevel% neq 0 (
    echo Failed to install Node.js. Exiting...
    exit /b %errorlevel%
)

:: Manually refresh the environment variables
set "NODE_PATH=%ProgramFiles%\nodejs"
set PATH=%NODE_PATH%;%PATH%

:: Command 2: execute shicmo.bat script
echo creating desktop and start menu shortcut...
start cmd /c "shicmo.bat"
if %errorlevel% neq 0 (
    echo shicmo.bat execution failed. Exiting...
    exit /b %errorlevel%
)

:: Command 3: Run npm install
echo Installing dependencies required for the app...
echo Don't worry Installation is about to finish!
npm i
if %errorlevel% neq 0 (
    echo npm install failed. Exiting...
    exit /b %errorlevel%
)

echo All tasks completed successfully.
pause
