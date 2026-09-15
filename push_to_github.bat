@echo off
title Push to GitHub - Sri Sri University Sports Council
color 0A
cd /d "C:\Users\User\Documents\Antigravity Projects"

echo ========================================================
echo Pushing Sri Sri University Sports Portal to GitHub...
echo Repository: https://github.com/rajeshg-SSU/ssu-sports-portal.git
echo ========================================================
echo.

set "GIT_EXE=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"

if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

echo Checking Git status...
"%GIT_EXE%" status

echo.
echo Starting Push to main branch...
echo (If a browser window or login dialog pops up, please sign in)
echo.

"%GIT_EXE%" push -u origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS! Code successfully pushed to GitHub!
    echo Now enable GitHub Pages in your repo settings.
) else (
    echo An error occurred during push. Please check the message above.
)
echo ========================================================
pause
