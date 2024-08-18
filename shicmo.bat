@echo off

:: Check if the script is running with administrator privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting elevated permissions...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~f0 %*' -Verb RunAs"
    exit /b
)

:: Set the target batch file name
set TARGET=wifile.bat

:: Set the directory and names for the shortcut and icon
set BASE_DIR=%~dp0
set SHORTCUT_NAME=%BASE_DIR%Wi-File.lnk
set ICON_PATH=%BASE_DIR%icons\wifileIcon.ico
set DEST_DIR=C:\ProgramData\Microsoft\Windows\Start Menu\Programs
set DESKTOP_DIR=%USERPROFILE%\Desktop

:: Create the shortcut using VBScript
echo Set oWS = WScript.CreateObject("WScript.Shell") > create_shortcut.vbs
echo sLinkFile = "%SHORTCUT_NAME%" >> create_shortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> create_shortcut.vbs
echo oLink.TargetPath = "%~dp0%TARGET%" >> create_shortcut.vbs
echo oLink.WorkingDirectory = "%~dp0" >> create_shortcut.vbs
echo oLink.IconLocation = "%ICON_PATH%" >> create_shortcut.vbs
echo oLink.Save >> create_shortcut.vbs

:: Run the VBScript to create the shortcut
cscript //nologo create_shortcut.vbs

:: Clean up the temporary VBScript
del create_shortcut.vbs

:: Copy the shortcut to the Start Menu Programs directory
xcopy "%SHORTCUT_NAME%" "%DEST_DIR%" /Y

:: Copy the shortcut to the Desktop
xcopy "%SHORTCUT_NAME%" "%DESKTOP_DIR%" /Y

echo Shortcut created in the current directory, copied to: %DEST_DIR% and %DESKTOP_DIR%

