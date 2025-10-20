# Permanent Data Storage

This directory contains JSON files that serve as the permanent data source for Stormers360. The data is automatically loaded into the PostgreSQL database when the server starts, ensuring there's always data to display in the application.

## How It Works

1. **JSON Files**: All initial data is stored in JSON files in this directory
2. **Auto-Seeding**: On server startup, the `seed.ts` script checks if the database is empty
3. **One-Time Load**: If empty, data is loaded from JSON files into the database
4. **Persistence**: Once loaded, data persists in PostgreSQL until manually cleared

## Data Files

### Core Modules

- **products.json** - Merchandise items for the shop (6 products)
- **courts.json** - Basketball courts in Toulouse with geo-coordinates (6 courts)
- **tournaments.json** - Tournament events (3 tournaments)
- **teams.json** - Basketball teams (4 teams)
- **players.json** - Individual players (4 players)

### Engagement & Media

- **media.json** - Videos and photos from tournaments (4 items)
- **inquiries.json** - Sponsor partnership inquiries (3 inquiries)
- **brandAssets.json** - Sponsor logos and banners (3 assets)

### Dynamic Data

- **Court Visibility Logs**: Generated automatically for the last 31 days based on court sponsor visibility metrics

## Modifying Data

To add, remove, or modify data:

1. Edit the appropriate JSON file in `server/data/`
2. Clear the database: `npm run db:push --force`
3. Restart the server - data will be re-seeded from JSON files

## Adding New Data Types

1. Create a new JSON file (e.g., `sponsors.json`)
2. Add loading logic in `server/seed.ts`
3. Ensure the corresponding storage method exists in `server/storage.ts`

## Benefits

✅ **Always Shows Data**: JSON files ensure there's always something to display  
✅ **Version Controlled**: Data changes are tracked in Git  
✅ **Easy to Edit**: JSON format is human-readable and editable  
✅ **Consistent Testing**: Same data every time for reliable testing  
✅ **Fast Recovery**: Database can be rebuilt from JSON files anytime
