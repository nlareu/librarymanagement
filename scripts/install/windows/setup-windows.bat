@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Library Management App - Windows Setup
echo ========================================
echo.
echo This script will install all required dependencies for the Library Management app.
echo Please run this script as Administrator for best results.
echo.
echo WINDOWS 7 USERS: This script is compatible with Windows 7, but requires:
echo - .NET Framework 4.8 (install manually if needed)
echo - Visual Studio 2019 Build Tools (not 2022)
echo - PowerShell 2.0 or later (usually pre-installed)
echo.
pause

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [INFO] Running with administrator privileges.
) else (
    echo [WARNING] Not running as administrator. Some installations may fail.
    echo Please consider running this script as Administrator.
    echo.
)

:: Create logs directory
if not exist "logs" mkdir logs
set LOGFILE=logs\setup-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log
echo Setup started at %date% %time% > "%LOGFILE%"

echo [STEP 1/7] Checking system requirements...
echo [STEP 1/7] Checking system requirements... >> "%LOGFILE%"

:: Check Windows version
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
echo System: Windows %VERSION%
echo System: Windows %VERSION% >> "%LOGFILE%"

:: Check PowerShell version (Windows 7 has PowerShell 2.0 by default)
powershell -Command "$PSVersionTable.PSVersion.Major" >nul 2>&1
if %errorLevel% == 0 (
    for /f %%i in ('powershell -Command "$PSVersionTable.PSVersion.Major" 2^>nul') do set PS_VERSION=%%i
    if !PS_VERSION! GEQ 2 (
        echo PowerShell: Available (Version !PS_VERSION!)
        echo PowerShell: Available (Version !PS_VERSION!) >> "%LOGFILE%"
    ) else (
        echo [WARNING] PowerShell version !PS_VERSION! detected. Some features may not work.
        echo [WARNING] PowerShell version !PS_VERSION! detected >> "%LOGFILE%"
    )
) else (
    echo [ERROR] PowerShell not available. Please install PowerShell 2.0 or later.
    echo [ERROR] PowerShell not available >> "%LOGFILE%"
    goto :error
)

echo.
echo [STEP 2/7] Installing Chocolatey package manager...
echo [STEP 2/7] Installing Chocolatey package manager... >> "%LOGFILE%"

:: Check if Chocolatey is installed
choco --version >nul 2>&1
if %errorLevel% == 0 (
    echo Chocolatey is already installed.
    echo Chocolatey is already installed. >> "%LOGFILE%"
) else (
    echo Installing Chocolatey...
    echo Installing Chocolatey... >> "%LOGFILE%"
    echo [INFO] Note: Windows 7 requires .NET Framework 4.8 for Chocolatey
    echo [INFO] Note: Windows 7 requires .NET Framework 4.8 for Chocolatey >> "%LOGFILE%"
    
    :: Windows 7 compatible Chocolatey installation with TLS 1.2 support
    powershell -Command "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch { Write-Host 'TLS 1.2 not available, using default' }; Set-ExecutionPolicy Bypass -Scope Process -Force; try { iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) } catch { Write-Host 'Installation failed:' $_.Exception.Message; exit 1 }" >> "%LOGFILE%" 2>&1
    if !errorLevel! neq 0 (
        echo [ERROR] Failed to install Chocolatey. Windows 7 may need manual .NET Framework installation.
        echo [ERROR] Please install .NET Framework 4.8 from Microsoft and try again.
        echo [ERROR] Failed to install Chocolatey on Windows 7 >> "%LOGFILE%"
        goto :error
    )
    
    :: Refresh PATH - Windows 7 compatible method
    for /f "delims=" %%i in ('powershell -Command "[Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('PATH', 'User')"') do set "PATH=%%i"
    echo Chocolatey installed successfully.
    echo Chocolatey installed successfully. >> "%LOGFILE%"
)

echo.
echo [STEP 3/7] Installing Node.js...
echo [STEP 3/7] Installing Node.js... >> "%LOGFILE%"

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% == 0 (
    for /f %%i in ('node --version') do set NODE_VERSION=%%i
    echo Node.js !NODE_VERSION! is already installed.
    echo Node.js !NODE_VERSION! is already installed. >> "%LOGFILE%"
) else (
    echo Installing Node.js...
    echo Installing Node.js... >> "%LOGFILE%"
    choco install nodejs -y >> "%LOGFILE%" 2>&1
    if !errorLevel! neq 0 (
        echo [ERROR] Failed to install Node.js.
        echo [ERROR] Failed to install Node.js. >> "%LOGFILE%"
        goto :error
    )
    
    :: Refresh PATH - Windows 7 compatible method
    for /f "delims=" %%i in ('powershell -Command "[Environment]::GetEnvironmentVariable('PATH', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('PATH', 'User')"') do set "PATH=%%i"
    echo Node.js installed successfully.
    echo Node.js installed successfully. >> "%LOGFILE%"
)

echo.
echo [STEP 4/7] Installing Rust...
echo [STEP 4/7] Installing Rust... >> "%LOGFILE%"

:: Check if Rust is installed
rustc --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=2" %%i in ('rustc --version') do set RUST_VERSION=%%i
    echo Rust !RUST_VERSION! is already installed.
    echo Rust !RUST_VERSION! is already installed. >> "%LOGFILE%"
) else (
    echo Installing Rust...
    echo Installing Rust... >> "%LOGFILE%"
    echo [INFO] Installing Rust for Windows 7 compatibility
    echo [INFO] Installing Rust for Windows 7 compatibility >> "%LOGFILE%"
    
    :: Download and install Rust with Windows 7 support
    powershell -Command "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch { Write-Host 'Using default security protocol' }; try { Invoke-WebRequest -Uri 'https://win.rustup.rs/x86_64' -OutFile 'rustup-init.exe' } catch { Write-Host 'Download failed:' $_.Exception.Message; exit 1 }" >> "%LOGFILE%" 2>&1
    if !errorLevel! neq 0 (
        echo [ERROR] Failed to download Rust installer. Check internet connection.
        echo [ERROR] Failed to download Rust installer. >> "%LOGFILE%"
        goto :error
    )
    
    :: Install Rust with default settings (Windows 7 compatible)
    echo Installing Rust (this may take several minutes)...
    rustup-init.exe -y --default-host x86_64-pc-windows-msvc --default-toolchain stable >> "%LOGFILE%" 2>&1
    if !errorLevel! neq 0 (
        echo [ERROR] Failed to install Rust. Windows 7 may need Visual C++ Redistributable.
        echo [ERROR] Failed to install Rust. >> "%LOGFILE%"
        goto :error
    )
    
    :: Clean up installer
    del rustup-init.exe
    
    :: Add Rust to PATH for current session
    set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
    
    echo Rust installed successfully.
    echo Rust installed successfully. >> "%LOGFILE%"
)

echo.
echo [STEP 5/7] Installing Visual Studio Build Tools...
echo [STEP 5/7] Installing Visual Studio Build Tools... >> "%LOGFILE%"

:: Check if Visual Studio Build Tools are installed
where cl >nul 2>&1
if %errorLevel% == 0 (
    echo Visual Studio Build Tools are already installed.
    echo Visual Studio Build Tools are already installed. >> "%LOGFILE%"
) else (
    echo Installing Visual Studio Build Tools...
    echo Installing Visual Studio Build Tools... >> "%LOGFILE%"
    echo [INFO] For Windows 7, installing Visual Studio 2019 Build Tools (last version supporting Win7)
    echo [INFO] Installing VS2019 Build Tools for Windows 7 >> "%LOGFILE%"
    
    choco install visualstudio2019buildtools --package-parameters "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended" -y >> "%LOGFILE%" 2>&1
    if !errorLevel! neq 0 (
        echo [WARNING] Failed to install Visual Studio Build Tools via Chocolatey.
        echo [WARNING] Failed to install Visual Studio Build Tools via Chocolatey. >> "%LOGFILE%"
        echo [INFO] For Windows 7, please manually install Visual Studio 2019 Build Tools from:
        echo [INFO] https://visualstudio.microsoft.com/vs/older-downloads/
        echo [INFO] Note: Visual Studio 2022 does NOT support Windows 7
        echo [INFO] Manual installation required for Windows 7 >> "%LOGFILE%"
    ) else (
        echo Visual Studio Build Tools installed successfully.
        echo Visual Studio Build Tools installed successfully. >> "%LOGFILE%"
    )
)

echo.
echo [STEP 6/7] Installing npm dependencies...
echo [STEP 6/7] Installing npm dependencies... >> "%LOGFILE%"

:: Install npm dependencies
echo Installing project dependencies...
echo Installing project dependencies... >> "%LOGFILE%"
npm install >> "%LOGFILE%" 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Failed to install npm dependencies.
    echo [ERROR] Failed to install npm dependencies. >> "%LOGFILE%"
    goto :error
)

:: Install Tauri CLI globally
echo Installing Tauri CLI...
echo Installing Tauri CLI... >> "%LOGFILE%"
npm install -g @tauri-apps/cli >> "%LOGFILE%" 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Failed to install Tauri CLI globally. You can install it later with:
    echo npm install -g @tauri-apps/cli
    echo [WARNING] Failed to install Tauri CLI globally. >> "%LOGFILE%"
) else (
    echo Tauri CLI installed successfully.
    echo Tauri CLI installed successfully. >> "%LOGFILE%"
)

:: Install ts-node for seeding script
echo Installing TypeScript tools...
echo Installing TypeScript tools... >> "%LOGFILE%"
npm install -g typescript ts-node >> "%LOGFILE%" 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Failed to install TypeScript tools globally.
    echo [WARNING] Failed to install TypeScript tools globally. >> "%LOGFILE%"
) else (
    echo TypeScript tools installed successfully.
    echo TypeScript tools installed successfully. >> "%LOGFILE%"
)

echo.
echo [STEP 7/7] Setting up database...
echo [STEP 7/7] Setting up database... >> "%LOGFILE%"

:: Setup database with test data
echo Setting up database with test data...
echo Setting up database with test data... >> "%LOGFILE%"
npm run seed:fresh >> "%LOGFILE%" 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Failed to seed database. You can do this later with:
    echo npm run seed:fresh
    echo [WARNING] Failed to seed database. >> "%LOGFILE%"
) else (
    echo Database setup completed successfully.
    echo Database setup completed successfully. >> "%LOGFILE%"
)

echo.
echo ========================================
echo          SETUP COMPLETED!
echo ========================================
echo.
echo All dependencies have been installed successfully.
echo.
echo You can now:
echo 1. Run the app in development mode: npm run tauri dev
echo 2. Build the app for production:   npm run tauri build
echo 3. Seed the database:              npm run seed:fresh
echo 4. Clear the database:             npm run seed:clear
echo.
echo The production build will create installers in:
echo src-tauri\target\release\bundle\
echo.
echo Log file saved to: %LOGFILE%
echo.
pause
goto :end

:error
echo.
echo ========================================
echo          SETUP FAILED!
echo ========================================
echo.
echo An error occurred during setup. Please check the log file:
echo %LOGFILE%
echo.
echo You may need to:
echo 1. Run this script as Administrator
echo 2. Check your internet connection
echo 3. Install components manually
echo.
echo For manual installation instructions, see:
echo https://tauri.app/v1/guides/getting-started/prerequisites
echo.
pause
exit /b 1

:end
echo Setup completed at %date% %time% >> "%LOGFILE%"
endlocal
