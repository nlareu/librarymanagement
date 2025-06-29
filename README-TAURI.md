# Library Management System - Tauri + SQLite

A desktop library management application built with React, TypeScript, Tauri, and SQLite.

## Features

- **Desktop Native App**: Cross-platform desktop application
- **SQLite Database**: Local, persistent data storage
- **Asset Management**: Add, edit, delete books and library items
- **User Management**: Manage students, teachers, and staff
- **Loan Tracking**: Track active loans and loan history
- **Modern UI**: React-based interface with responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Webpack
- **Backend**: Rust, Tauri
- **Database**: SQLite (with rusqlite)
- **Desktop**: Tauri framework

## Prerequisites

- Node.js (v16 or higher)
- Rust (installed automatically during first run)
- npm or yarn

## Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Install Rust (if not already installed):**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   ```

## Development

### Start Development Server

```bash
npm run tauri:dev
```

This will:

- Start webpack dev server for the frontend
- Compile and run the Tauri backend
- Open the desktop application window
- Enable hot reload for both frontend and backend

### Build for Production

```bash
npm run tauri:build
```

Creates platform-specific installers in `src-tauri/target/release/bundle/`

## Database

### Location

The SQLite database is automatically created at:

- **macOS**: `~/Library/Application Support/com.tauri.dev/library.db`
- **Windows**: `%APPDATA%/com.tauri.dev/library.db`
- **Linux**: `~/.local/share/com.tauri.dev/library.db`

### Schema

- **assets**: Library items (books, materials)
- **users**: Students, teachers, staff
- **active_loans**: Current borrowed items
- **loan_history**: Completed loan records

### Data Migration

On first run, the app will:

1. Create the SQLite database
2. Import initial data from JSON files
3. All subsequent data is stored in SQLite

## Architecture

### Frontend (React/TypeScript)

```
src/
├── components/           # React components
├── hooks/               # React hooks
├── data/
│   ├── tauri-db.ts     # Database interface
│   └── tauri-api.ts    # Business logic
└── entities/           # TypeScript types
```

### Backend (Rust/Tauri)

```
src-tauri/src/
├── database/
│   ├── models.rs       # Data models
│   └── db.rs          # SQLite operations
├── commands.rs         # Tauri commands
└── lib.rs             # Main application
```

## Available Scripts

- `npm run dev` - Start webpack dev server only
- `npm run build` - Build frontend for production
- `npm run tauri:dev` - Start Tauri development mode
- `npm run tauri:build` - Build desktop application
- `npm run tauri` - Run tauri CLI commands

## Configuration

### Tauri Configuration

Edit `src-tauri/tauri.conf.json` to modify:

- App name and identifier
- Window dimensions
- Bundle settings
- Security policies

### Database Configuration

The database is automatically configured and created. To modify the schema, edit:

- `src-tauri/src/database/models.rs` - Data structures
- `src-tauri/src/database/db.rs` - Database operations

## Troubleshooting

### First Run Takes Long

The first `npm run tauri:dev` will download and compile all Rust dependencies. This is normal and only happens once.

### Database Issues

If you encounter database issues:

1. Delete the database file (see locations above)
2. Restart the application
3. The database will be recreated with starter data

### Build Issues

Ensure you have:

- Latest Rust toolchain: `rustup update`
- All system dependencies for your platform
- Sufficient disk space for compilation

## Contributing

1. Make changes to frontend code in `src/`
2. Make changes to backend code in `src-tauri/src/`
3. Test with `npm run tauri:dev`
4. Build with `npm run tauri:build`

## License

Apache-2.0
