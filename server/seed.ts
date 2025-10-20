import { storage } from "./storage";
import { promises as fs } from "fs";
import { join } from "path";

async function loadJSON<T>(filename: string): Promise<T> {
  const filePath = join(__dirname, "data", filename);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

async function seed() {
  console.log("Checking if database needs seeding...");

  // Check if data already exists
  const existingProducts = await storage.getProducts();
  if (existingProducts.length > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  console.log("Seeding database from JSON files...");

  // Seed Products
  const products = await loadJSON<any[]>("products.json");
  for (const product of products) {
    await storage.createProduct(product);
  }
  console.log(`✓ Created ${products.length} products`);

  // Seed Courts
  const courts = await loadJSON<any[]>("courts.json");
  for (const court of courts) {
    await storage.createCourt(court);
  }
  console.log(`✓ Created ${courts.length} courts`);

  // Seed Tournaments
  const tournaments = await loadJSON<any[]>("tournaments.json");
  for (const tournament of tournaments) {
    await storage.createTournament(tournament);
  }
  console.log(`✓ Created ${tournaments.length} tournaments`);

  // Seed Teams
  const teams = await loadJSON<any[]>("teams.json");
  for (const team of teams) {
    await storage.createTeam(team);
  }
  console.log(`✓ Created ${teams.length} teams`);

  // Seed Players
  const players = await loadJSON<any[]>("players.json");
  for (const player of players) {
    await storage.createPlayer(player);
  }
  console.log(`✓ Created ${players.length} players`);

  // Seed Media
  const media = await loadJSON<any[]>("media.json");
  for (const mediaItem of media) {
    await storage.createMedia(mediaItem);
  }
  console.log(`✓ Created ${media.length} media items`);

  // Seed Inquiries
  const inquiries = await loadJSON<any[]>("inquiries.json");
  for (const inquiry of inquiries) {
    await storage.createInquiry(inquiry);
  }
  console.log(`✓ Created ${inquiries.length} inquiries`);

  // Seed Brand Assets
  const brandAssets = await loadJSON<any[]>("brandAssets.json");
  for (const asset of brandAssets) {
    await storage.createBrandAsset(asset);
  }
  console.log(`✓ Created ${brandAssets.length} brand assets`);

  // Generate Court Visibility Logs (last 31 days)
  const courtsList = await storage.getCourts();
  const visibilityLogsToCreate = [];
  const today = new Date();
  
  for (const court of courtsList) {
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const baseViews = Math.floor(court.sponsorVisibility / 30);
      const variation = Math.floor(Math.random() * 20) - 10;
      const views = Math.max(baseViews + variation, 5);
      const uniqueVisitors = Math.floor(views * 0.7);

      visibilityLogsToCreate.push({
        courtId: court.id,
        date: dateStr,
        views,
        uniqueVisitors
      });
    }
  }

  for (const log of visibilityLogsToCreate) {
    await storage.createCourtVisibilityLog(log);
  }
  console.log(`✓ Created ${visibilityLogsToCreate.length} visibility logs`);

  console.log("✅ Database seeding complete!");
}

export { seed };
