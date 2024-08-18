@echo off
winget install OpenJS.NodeJS
:: Manually refresh the environment variables
set "NODE_PATH=%ProgramFiles%\nodejs"
set PATH=%NODE_PATH%;%PATH%
npm i
