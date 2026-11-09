@echo off
rem Sends every row of tech-webform-tickets.xlsx through the Tech Webform. Use --dry-run to check first.
cd /d "%~dp0"
if not exist node_modules\exceljs (
  echo Installing exceljs...
  call npm install --no-audit --no-fund
)
node fill-webform.js --file tech-webform-tickets.xlsx %*
echo.
pause
