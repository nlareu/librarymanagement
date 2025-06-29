# Library Management App - Windows Setup (PowerShell)
# Run this script as Administrator for best results

param(
    [switch]$SkipChoco,
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Continue"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

Write-Host "========================================" -ForegroundColor Green
Write-Host "Library Management App - Windows Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "[INFO] Running with administrator privileges." -ForegroundColor Green
} else {
    Write-Host "[WARNING] Not running as administrator. Some installations may fail." -ForegroundColor Yellow
    Write-Host "Consider running: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    Write-Host ""
}

# Create logs directory
$logDir = "logs"
if (!(Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logFile = "$logDir\setup-$timestamp.log"
"Setup started at $(Get-Date)" | Out-File -FilePath $logFile

function Write-Log {
    param($Message, $Color = "White")
    Write-Host $Message -ForegroundColor $Color
    $Message | Out-File -FilePath $logFile -Append
}

function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction SilentlyContinue) {
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

# Step 1: Check system requirements
Write-Log "[STEP 1/7] Checking system requirements..." "Cyan"
$osVersion = [System.Environment]::OSVersion.Version
Write-Log "System: Windows $($osVersion.Major).$($osVersion.Minor)"

# Step 2: Install Chocolatey (if not skipped)
if (!$SkipChoco) {
    Write-Log "[STEP 2/7] Installing Chocolatey package manager..." "Cyan"
    
    if (Test-Command "choco") {
        $chocoVersion = choco --version
        Write-Log "Chocolatey $chocoVersion is already installed."
    } else {
        Write-Log "Installing Chocolatey..."
        try {
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            Write-Log "Chocolatey installed successfully." "Green"
        } catch {
            Write-Log "[ERROR] Failed to install Chocolatey: $($_.Exception.Message)" "Red"
        }
    }
} else {
    Write-Log "[STEP 2/7] Skipping Chocolatey installation..." "Yellow"
}

# Step 3: Install Node.js
Write-Log "[STEP 3/7] Installing Node.js..." "Cyan"

if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Log "Node.js $nodeVersion is already installed."
} else {
    Write-Log "Installing Node.js..."
    try {
        if (Test-Command "choco") {
            choco install nodejs -y
            Write-Log "Node.js installed successfully via Chocolatey." "Green"
        } else {
            Write-Log "Please install Node.js manually from: https://nodejs.org" "Yellow"
        }
    } catch {
        Write-Log "[ERROR] Failed to install Node.js: $($_.Exception.Message)" "Red"
    }
}

# Step 4: Install Rust
Write-Log "[STEP 4/7] Installing Rust..." "Cyan"

if (Test-Command "rustc") {
    $rustVersion = rustc --version
    Write-Log "Rust $rustVersion is already installed."
} else {
    Write-Log "Installing Rust..."
    try {
        $rustupUrl = "https://win.rustup.rs/x86_64"
        $rustupPath = "$env:TEMP\rustup-init.exe"
        
        Write-Log "Downloading Rust installer..."
        Invoke-WebRequest -Uri $rustupUrl -OutFile $rustupPath
        
        Write-Log "Installing Rust..."
        Start-Process -FilePath $rustupPath -ArgumentList "-y" -Wait
        
        # Add Rust to PATH
        $cargoPath = "$env:USERPROFILE\.cargo\bin"
        if ($env:PATH -notlike "*$cargoPath*") {
            $env:PATH += ";$cargoPath"
        }
        
        Remove-Item $rustupPath -ErrorAction SilentlyContinue
        Write-Log "Rust installed successfully." "Green"
    } catch {
        Write-Log "[ERROR] Failed to install Rust: $($_.Exception.Message)" "Red"
    }
}

# Step 5: Install Visual Studio Build Tools
Write-Log "[STEP 5/7] Installing Visual Studio Build Tools..." "Cyan"

$vsInstalled = $false
try {
    # Check for cl.exe in PATH
    if (Get-Command "cl" -ErrorAction SilentlyContinue) {
        $vsInstalled = $true
    }
} catch {}

if ($vsInstalled) {
    Write-Log "Visual Studio Build Tools are already installed."
} else {
    Write-Log "Installing Visual Studio Build Tools..."
    try {
        if (Test-Command "choco") {
            choco install visualstudio2022buildtools --package-parameters "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended" -y
            Write-Log "Visual Studio Build Tools installed successfully." "Green"
        } else {
            Write-Log "Please install Visual Studio Build Tools manually from:" "Yellow"
            Write-Log "https://visualstudio.microsoft.com/visual-cpp-build-tools/" "Yellow"
        }
    } catch {
        Write-Log "[WARNING] Failed to install Visual Studio Build Tools: $($_.Exception.Message)" "Yellow"
        Write-Log "You may need to install them manually." "Yellow"
    }
}

# Step 6: Install npm dependencies
Write-Log "[STEP 6/7] Installing npm dependencies..." "Cyan"

if (Test-Path "package.json") {
    try {
        Write-Log "Installing project dependencies..."
        npm install
        Write-Log "Project dependencies installed successfully." "Green"
        
        Write-Log "Installing Tauri CLI..."
        npm install -g @tauri-apps/cli
        Write-Log "Tauri CLI installed successfully." "Green"
        
        Write-Log "Installing TypeScript tools..."
        npm install -g typescript ts-node
        Write-Log "TypeScript tools installed successfully." "Green"
    } catch {
        Write-Log "[ERROR] Failed to install npm dependencies: $($_.Exception.Message)" "Red"
    }
} else {
    Write-Log "[WARNING] package.json not found. Make sure you're in the project directory." "Yellow"
}

# Step 7: Setup database
Write-Log "[STEP 7/7] Setting up database..." "Cyan"

try {
    Write-Log "Setting up database with test data..."
    npm run seed:fresh
    Write-Log "Database setup completed successfully." "Green"
} catch {
    Write-Log "[WARNING] Failed to seed database: $($_.Exception.Message)" "Yellow"
    Write-Log "You can do this later with: npm run seed:fresh" "Yellow"
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "          SETUP COMPLETED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "All dependencies have been installed successfully." -ForegroundColor Green
Write-Host ""
Write-Host "You can now:" -ForegroundColor White
Write-Host "1. Run the app in development mode: " -NoNewline -ForegroundColor White
Write-Host "npm run tauri dev" -ForegroundColor Yellow
Write-Host "2. Build the app for production:   " -NoNewline -ForegroundColor White
Write-Host "npm run tauri build" -ForegroundColor Yellow
Write-Host "3. Seed the database:              " -NoNewline -ForegroundColor White
Write-Host "npm run seed:fresh" -ForegroundColor Yellow
Write-Host "4. Clear the database:             " -NoNewline -ForegroundColor White
Write-Host "npm run seed:clear" -ForegroundColor Yellow
Write-Host ""
Write-Host "The production build will create installers in:" -ForegroundColor White
Write-Host "src-tauri\target\release\bundle\" -ForegroundColor Yellow
Write-Host ""
Write-Host "Log file saved to: $logFile" -ForegroundColor Gray

"Setup completed at $(Get-Date)" | Out-File -FilePath $logFile -Append
