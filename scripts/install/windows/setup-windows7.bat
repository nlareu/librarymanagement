@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Library Management App - Windows 7 Setup
echo ========================================
echo.
echo This script is specifically designed for Windows 7 compatibility.
echo Please run this script as Administrator for best results.
echo.
echo REQUIREMENTS FOR WINDOWS 7:
echo - .NET Framework 4.8 (will be checked)
echo - PowerShell 2.0+ (usually pre-installed)
echo - Visual Studio 2019 Build Tools (VS2022 not supported on Win7)
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
set LOGFILE=logs\setup-win7-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log
echo Windows 7 Setup started at %date% %time% > "%LOGFILE%"

echo [STEP 1/8] Checking Windows 7 system requirements...
echo [STEP 1/8] Checking Windows 7 system requirements... >> "%LOGFILE%"

:: Check Windows version
for /f "tokens=4-5 delims=. " %%i in ('ver') do set VERSION=%%i.%%j
echo System: Windows %VERSION%
echo System: Windows %VERSION% >> "%LOGFILE%"

if "%VERSION%" == "6.1" (
    echo [INFO] Windows 7 detected - using compatible installation methods
    echo [INFO] Windows 7 detected >> "%LOGFILE%"
) else (
    echo [WARNING] This script is optimized for Windows 7. You may want to use setup-windows.bat instead.
    echo [WARNING] Non-Windows 7 system detected >> "%LOGFILE%"
)

:: Check .NET Framework version
echo Checking .NET Framework version...
echo Checking .NET Framework version... >> "%LOGFILE%"
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=3" %%i in ('reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release ^| find "Release"') do set NET_RELEASE=%%i
    if !NET_RELEASE! GEQ 528040 (
        echo [INFO] .NET Framework 4.8+ detected
        echo [INFO] .NET Framework 4.8+ detected >> "%LOGFILE%"
    ) else (
        echo [WARNING] .NET Framework 4.8 not detected. Chocolatey may not work.
        echo [WARNING] Please install .NET Framework 4.8 from Microsoft
        echo [WARNING] .NET Framework 4.8 not detected >> "%LOGFILE%"
    )
) else (
    echo [WARNING] Could not detect .NET Framework version
    echo [WARNING] Could not detect .NET Framework version >> "%LOGFILE%"
)

:: Check PowerShell version
echo Checking PowerShell version...
echo Checking PowerShell version... >> "%LOGFILE%"
for /f %%i in ('powershell -Command "$PSVersionTable.PSVersion.Major" 2^>nul') do set PS_VERSION=%%i
if defined PS_VERSION (
    echo PowerShell: Version !PS_VERSION! available
    echo PowerShell: Version !PS_VERSION! available >> "%LOGFILE%"
    if !PS_VERSION! LSS 2 (
        echo [ERROR] PowerShell 2.0 or later required for this script
        echo [ERROR] PowerShell 2.0 or later required >> "%LOGFILE%"
        goto :error
    )
) else (
    echo [ERROR] PowerShell not available or not working
    echo [ERROR] PowerShell not available >> "%LOGFILE%"
    goto :error
)

echo.
echo [STEP 2/8] Installing Chocolatey (Windows 7 compatible)...
echo [STEP 2/8] Installing Chocolatey (Windows 7 compatible)... >> "%LOGFILE%"

:: Check if Chocolatey is installed
choco --version >nul 2>&1
if %errorLevel% == 0 (
    echo Chocolatey is already installed.
    echo Chocolatey is already installed. >> "%LOGFILE%"
) else (
    echo Installing Chocolatey for Windows 7...
    echo Installing Chocolatey for Windows 7... >> "%LOGFILE%"
    
    :: Windows 7 specific installation with fallback methods
    echo [INFO] Attempting TLS 1.2 installation...
    powershell -Command "try { [Net.ServicePointManager]::SecurityProtocol = 'Tls12' } catch { [Net.ServicePointManager]::SecurityProtocol = 'Tls' }; Set-ExecutionPolicy Bypass -Scope Process -Force; try { iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1')) } catch { Write-Host 'Primary installation failed, trying alternative...'; try { iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')) } catch { Write-Host 'Installation failed:' $_.Exception.Message; exit 1 } }" >> "%LOGFILE%" 2>&1
    
    if !errorLevel! neq 0 (
        echo [WARNING] Chocolatey installation failed. Continuing with manual downloads...
        echo [WARNING] Chocolatey installation failed >> "%LOGFILE%"
        set CHOCO_FAILED=1
    ) else (
        :: Manual PATH refresh for Windows 7
        set "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
        echo Chocolatey installed successfully.
        echo Chocolatey installed successfully. >> "%LOGFILE%"
        set CHOCO_FAILED=0
    )
)

echo.
echo [STEP 3/8] Installing Node.js (Windows 7 compatible)...
echo [STEP 3/8] Installing Node.js (Windows 7 compatible)... >> "%LOGFILE%"

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% == 0 (
    for /f %%i in ('node --version') do set NODE_VERSION=%%i
    echo Node.js !NODE_VERSION! is already installed.
    echo Node.js !NODE_VERSION! is already installed. >> "%LOGFILE%"
) else (
    echo Installing Node.js...
    echo Installing Node.js... >> "%LOGFILE%"
    
    if "!CHOCO_FAILED!" == "0" (
        :: Try Chocolatey first - install Node.js 16 (last version supporting Windows 7)
        choco install nodejs --version=16.20.2 -y >> "%LOGFILE%" 2>&1
        if !errorLevel! neq 0 (
            echo [WARNING] Chocolatey Node.js installation failed
            echo [WARNING] Chocolatey Node.js installation failed >> "%LOGFILE%"
            set NODE_MANUAL=1
        ) else (
            set NODE_MANUAL=0
        )
    ) else (
        set NODE_MANUAL=1
    )
    
    if "!NODE_MANUAL!" == "1" (
        echo [INFO] Please manually install Node.js 16.x from:
        echo [INFO] https://nodejs.org/dist/v16.20.2/node-v16.20.2-x64.msi
        echo [INFO] Node.js 18+ does not support Windows 7
        echo [INFO] Manual Node.js installation required >> "%LOGFILE%"
        pause
    ) else (
        echo Node.js installed successfully.
        echo Node.js installed successfully. >> "%LOGFILE%"
    )
)

echo.
echo [STEP 4/8] Installing Rust (Windows 7 compatible)...
echo [STEP 4/8] Installing Rust (Windows 7 compatible)... >> "%LOGFILE%"

:: Check if Rust is installed
rustc --version >nul 2>&1
if %errorLevel% == 0 (
    for /f "tokens=2" %%i in ('rustc --version') do set RUST_VERSION=%%i
    echo Rust !RUST_VERSION! is already installed.
    echo Rust !RUST_VERSION! is already installed. >> "%LOGFILE%"
) else (
    echo Installing Rust for Windows 7...
    echo Installing Rust for Windows 7... >> "%LOGFILE%"
    
    :: Download Rust installer with Windows 7 compatibility
    echo Downloading Rust installer (Windows 7 compatible)...
    powershell -Command "try { [Net.ServicePointManager]::SecurityProtocol = 'Tls12' } catch { [Net.ServicePointManager]::SecurityProtocol = 'Tls' }; try { (New-Object System.Net.WebClient).DownloadFile('https://forge.rust-lang.org/infra/channel-specific-build-information.html', 'rust-check.tmp'); Remove-Item 'rust-check.tmp' -ErrorAction SilentlyContinue; (New-Object System.Net.WebClient).DownloadFile('https://win.rustup.rs/x86_64', 'rustup-init.exe') } catch { Write-Host 'Download failed:' $_.Exception.Message; exit 1 }" >> "%LOGFILE%" 2>&1
    
    if !errorLevel! neq 0 (
        echo [ERROR] Failed to download Rust installer. Check internet connection.
        echo [ERROR] Failed to download Rust installer. >> "%LOGFILE%"
        goto :error
    )
    
    :: Install Rust with Windows 7 specific settings
    echo Installing Rust (this may take several minutes)...
    rustup-init.exe -y --default-host x86_64-pc-windows-msvc --default-toolchain stable >> "%LOGFILE%" 2>&1
    if !errorLevel! neq 0 (
        echo [ERROR] Failed to install Rust.
        echo [ERROR] Windows 7 may need Visual C++ 2015-2019 Redistributable
        echo [ERROR] Failed to install Rust. >> "%LOGFILE%"
        goto :error
    )
    
    :: Clean up installer
    del rustup-init.exe >nul 2>&1
    
    :: Add Rust to PATH for current session
    set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"
    
    echo Rust installed successfully.
    echo Rust installed successfully. >> "%LOGFILE%"
)

echo.
echo [STEP 5/8] Installing Visual Studio 2019 Build Tools (Windows 7)...
echo [STEP 5/8] Installing Visual Studio 2019 Build Tools (Windows 7)... >> "%LOGFILE%"

:: Check if Visual Studio Build Tools are installed
where cl >nul 2>&1
if %errorLevel% == 0 (
    echo Visual Studio Build Tools are already installed.
    echo Visual Studio Build Tools are already installed. >> "%LOGFILE%"
) else (
    echo Installing Visual Studio 2019 Build Tools for Windows 7...
    echo Installing Visual Studio 2019 Build Tools for Windows 7... >> "%LOGFILE%"
    
    if "!CHOCO_FAILED!" == "0" (
        choco install visualstudio2019buildtools --package-parameters "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended" -y >> "%LOGFILE%" 2>&1
        if !errorLevel! neq 0 (
            echo [WARNING] Failed to install VS2019 Build Tools via Chocolatey.
            echo [WARNING] Failed to install VS2019 Build Tools via Chocolatey. >> "%LOGFILE%"
            set VS_MANUAL=1
        ) else (
            echo Visual Studio 2019 Build Tools installed successfully.
            echo Visual Studio 2019 Build Tools installed successfully. >> "%LOGFILE%"
            set VS_MANUAL=0
        )
    ) else (
        set VS_MANUAL=1
    )
    
    if "!VS_MANUAL!" == "1" (
        echo [INFO] Please manually install Visual Studio 2019 Build Tools:
        echo [INFO] https://visualstudio.microsoft.com/vs/older-downloads/
        echo [INFO] Select "Build Tools for Visual Studio 2019"
        echo [INFO] IMPORTANT: Visual Studio 2022 does NOT support Windows 7
        echo [INFO] Manual VS2019 Build Tools installation required >> "%LOGFILE%"
        pause
    )
)

echo.
echo [STEP 6/8] Installing Visual C++ Redistributables (Windows 7)...
echo [STEP 6/8] Installing Visual C++ Redistributables (Windows 7)... >> "%LOGFILE%"

if "!CHOCO_FAILED!" == "0" (
    echo Installing required Visual C++ Redistributables...
    choco install vcredist140 -y >> "%LOGFILE%" 2>&1
    if !errorLevel! neq 0 (
        echo [WARNING] Failed to install VC++ Redistributables via Chocolatey
        echo [WARNING] Failed to install VC++ Redistributables >> "%LOGFILE%"
    ) else (
        echo Visual C++ Redistributables installed successfully.
        echo Visual C++ Redistributables installed successfully. >> "%LOGFILE%"
    )
) else (
    echo [INFO] Please manually install Visual C++ 2015-2019 Redistributable from Microsoft
    echo [INFO] Manual VC++ Redistributable installation needed >> "%LOGFILE%"
)

echo.
echo [STEP 7/8] Installing npm dependencies...
echo [STEP 7/8] Installing npm dependencies... >> "%LOGFILE%"

:: Check if Node.js is available before proceeding
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Node.js not available. Please install Node.js first.
    echo [ERROR] Node.js not available >> "%LOGFILE%"
    goto :error
)

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

:: Install TypeScript tools
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
echo [STEP 8/8] Setting up database...
echo [STEP 8/8] Setting up database... >> "%LOGFILE%"

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
echo     WINDOWS 7 SETUP COMPLETED!
echo ========================================
echo.
echo All dependencies have been installed for Windows 7 compatibility.
echo.
echo You can now:
echo 1. Run the app in development mode: npm run tauri dev
echo 2. Build the app for production:   npm run tauri build
echo 3. Seed the database:              npm run seed:fresh
echo 4. Clear the database:             npm run seed:clear
echo.
echo WINDOWS 7 NOTES:
echo - The app will use older versions of some tools for compatibility
echo - Node.js 16.x is the last version supporting Windows 7
echo - Visual Studio 2019 Build Tools are required (not 2022)
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
echo        WINDOWS 7 SETUP FAILED!
echo ========================================
echo.
echo An error occurred during setup. Please check the log file:
echo %LOGFILE%
echo.
echo WINDOWS 7 SPECIFIC TROUBLESHOOTING:
echo 1. Install .NET Framework 4.8 manually from Microsoft
echo 2. Install Visual C++ 2015-2019 Redistributable
echo 3. Use Node.js 16.x (newer versions don't support Windows 7)
echo 4. Use Visual Studio 2019 Build Tools (not 2022)
echo 5. Run this script as Administrator
echo 6. Check your internet connection
echo.
echo For manual installation instructions, see:
echo https://tauri.app/v1/guides/getting-started/prerequisites
echo.
pause
exit /b 1

:end
echo Windows 7 setup completed at %date% %time% >> "%LOGFILE%"
endlocal
