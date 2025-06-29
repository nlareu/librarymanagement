# Windows Installation Guide

This guide will help you set up the Library Management application on Windows, including **Windows 7 compatibility**.

## 🚀 Quick Setup (Recommended)

We've provided automated setup scripts to install all dependencies:

### For Windows 10/11 (Modern Windows)

#### Option 1: Batch File (Simple)

1. **Download** or copy the entire project folder to your Windows machine
2. **Open Command Prompt as Administrator**
3. **Navigate** to the project folder
4. **Run the setup script:**
   ```cmd
   setup-windows.bat
   ```

#### Option 2: PowerShell Script (Advanced)

1. **Download** or copy the entire project folder to your Windows machine
2. **Open PowerShell as Administrator**
3. **Navigate** to the project folder
4. **Allow script execution:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
5. **Run the setup script:**
   ```powershell
   .\setup-windows.ps1
   ```

### For Windows 7 (Legacy Support)

#### Windows 7 Specific Setup

1. **Download** or copy the entire project folder to your Windows 7 machine
2. **Open Command Prompt as Administrator**
3. **Navigate** to the project folder
4. **Run the Windows 7 compatible script:**
   ```cmd
   setup-windows7.bat
   ```

**⚠️ Windows 7 Requirements:**

- .NET Framework 4.8 (may need manual installation)
- PowerShell 2.0+ (usually pre-installed)
- Node.js 16.x (newer versions don't support Windows 7)
- Visual Studio 2019 Build Tools (VS2022 doesn't support Windows 7)

## 📋 What the Scripts Install

The setup scripts will automatically install:

1. **Chocolatey** - Package manager for Windows
2. **Node.js** - JavaScript runtime (v16.x for Windows 7, latest for Windows 10/11)
3. **Rust** - Programming language (required for Tauri backend)
4. **Visual Studio Build Tools** - C++ compiler (VS2019 for Windows 7, VS2022 for newer)
5. **Project Dependencies** - All npm packages
6. **Tauri CLI** - Command line tools for building the app
7. **TypeScript Tools** - For running the database seeding script

### Version Compatibility

| Windows Version | Node.js               | Visual Studio      | Script                        |
| --------------- | --------------------- | ------------------ | ----------------------------- |
| Windows 7       | 16.x (last supported) | VS2019 Build Tools | `setup-windows7.bat`          |
| Windows 8.1+    | Latest LTS            | VS2022 Build Tools | `setup-windows.bat`           |
| Windows 10/11   | Latest LTS            | VS2022 Build Tools | `setup-windows.bat` or `.ps1` |

## 🏃‍♂️ Running the Application

After installation, you can:

### Development Mode

```cmd
npm run tauri dev
```

This will start the app in development mode with hot-reload.

### Production Build

```cmd
npm run tauri build
```

This creates installers in `src-tauri\target\release\bundle\`:

- `*.msi` - Windows Installer package
- `*.exe` - Setup executable
- Raw executable file

### Database Management

```cmd
# Setup database with test data
npm run seed:fresh

# Clear all data
npm run seed:clear

# Add test data to existing database
npm run seed:direct
```

## 🛠️ Manual Installation (If Automated Setup Fails)

### For Windows 10/11

#### 1. Install Node.js

- Download from: https://nodejs.org
- Install the LTS version
- Verify: `node --version`

#### 2. Install Rust

- Download from: https://rustup.rs
- Run the installer and follow prompts
- Verify: `rustc --version`

#### 3. Install Visual Studio Build Tools

- Download from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Install "C++ build tools" workload
- Verify: `cl` command should be available

### For Windows 7

#### 1. Install .NET Framework 4.8

- Download from: https://dotnet.microsoft.com/download/dotnet-framework/net48
- Required for Chocolatey and modern tools

#### 2. Install Node.js 16.x

- Download from: https://nodejs.org/dist/v16.20.2/node-v16.20.2-x64.msi
- **Important**: Node.js 18+ does not support Windows 7
- Verify: `node --version`

#### 3. Install Rust

- Download from: https://forge.rust-lang.org/infra/windows.html
- Use the x86_64-pc-windows-msvc toolchain
- Verify: `rustc --version`

#### 4. Install Visual Studio 2019 Build Tools

- Download from: https://visualstudio.microsoft.com/vs/older-downloads/
- Select "Build Tools for Visual Studio 2019"
- **Important**: Visual Studio 2022 does NOT support Windows 7
- Install "C++ build tools" workload
- Verify: `cl` command should be available

#### 5. Install Visual C++ Redistributable

- Download from Microsoft: VC++ 2015-2019 Redistributable
- Required for Rust and native dependencies

### 4. Install Project Dependencies

```cmd
npm install
npm install -g @tauri-apps/cli
npm install -g typescript ts-node
```

### 5. Setup Database

```cmd
npm run seed:fresh
```

## 🗂️ File Structure After Build

After running `npm run tauri build`, you'll find the distributable files in:

```
src-tauri/target/release/bundle/
├── msi/
│   └── libraryManagement_0.1.0_x64_en-US.msi     # Windows Installer
├── nsis/
│   └── libraryManagement_0.1.0_x64-setup.exe     # Setup Executable
└── app.exe                                        # Standalone Executable
```

## 📦 Distribution

To distribute the app to other Windows users:

1. **Recommended**: Share the `.msi` or `-setup.exe` file from the bundle folder
2. **Alternative**: Share the standalone `.exe` file (may require additional DLLs)

## 🐛 Troubleshooting

### Common Issues:

1. **"command not found" errors**: Restart your command prompt/PowerShell after installation
2. **Permission errors**: Run Command Prompt/PowerShell as Administrator
3. **Build failures**: Ensure all dependencies are installed correctly
4. **Database errors**: Make sure you have write permissions in the app data directory

### Windows 7 Specific Issues:

1. **TLS/SSL errors**: Install .NET Framework 4.8 first
2. **Chocolatey installation fails**: Manual installation of .NET Framework 4.8 required
3. **Node.js version conflicts**: Use Node.js 16.x only (newer versions don't support Windows 7)
4. **Visual Studio errors**: Use VS2019 Build Tools, not VS2022
5. **Missing VC++ Runtime**: Install Visual C++ 2015-2019 Redistributable manually
6. **PowerShell errors**: Ensure PowerShell 2.0+ is available (usually pre-installed)

### Database Location

The SQLite database is stored at:

```
%APPDATA%\com.library.management\library.db
```

### Log Files

Setup logs are saved in the `logs\` directory for troubleshooting.

## 📞 Support

If you encounter issues:

1. Check the log files in the `logs\` directory
2. Ensure you're running as Administrator
3. Verify all dependencies are installed correctly
4. Check that your antivirus isn't blocking the installation

The application creates a local SQLite database and works completely offline once installed.
