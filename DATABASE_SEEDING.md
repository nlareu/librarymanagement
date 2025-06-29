# Database Seeding

This project provides multiple ways to seed the database with test data.

## Direct SQLite Seeding (Recommended) ✅

**Works independently without the Tauri app running**

The direct seeding script uses Node.js with the `sqlite3` library to directly access the SQLite database file.

### Commands:

```bash
# Seed the database with test data
npm run seed:direct

# Clear all data from the database
npm run seed:clear

# Clear and then seed with fresh data
npm run seed:fresh
```

### Features:

- ✅ Works without the Tauri app running
- ✅ Direct SQLite database access
- ✅ Fast and reliable
- ✅ Full TypeScript support
- ✅ Proper error handling
- ✅ Database path auto-detection

### Test Data Included:

- **5 Assets**: Books and movies with complete metadata
- **5 Users**: Students and teachers with contact information
- **2 Active Loans**: Current borrowing records
- **3 Loan History**: Past loan records with return dates

## Database Location

The script automatically detects the database location based on your operating system:

- **macOS**: `~/Library/Application Support/com.tauri.dev/library.db`
- **Windows**: `%APPDATA%/com.tauri.dev/library.db`
- **Linux**: `~/.local/share/com.tauri.dev/library.db`

## Troubleshooting

If you encounter any issues:

1. **Make sure dependencies are installed**: `npm install`
2. **Check database permissions**: Ensure the app data directory is writable
3. **Verify database path**: Check the console output for the exact database location

## Alternative: In-App Seeding

If you prefer to seed from within the app:

1. Start the app: `npm run tauri:dev`
2. Open browser developer tools (F12)
3. Use the browser console to call seeding functions (when implemented)

---

**Note**: The direct SQLite approach is recommended as it provides the most flexibility and doesn't require the Tauri app to be running.
