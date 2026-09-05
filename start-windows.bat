@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  npm install
)
start "AMZ BB Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul
start "AMZ BB Telegram Bot" cmd /k "npm run bot"
start "AMZ BB" http://localhost:3000
