import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Tournament Management Schemas
export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  date: text("date").notNull(),
  format: text("format").notNull(),
  status: text("status").notNull().default('upcoming'),
  maxTeams: integer("max_teams").notNull().default(16),
  createdAt: text("created_at").notNull(),
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  createdAt: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  university: text("university"),
  tournamentId: varchar("tournament_id").notNull(),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  wins: true,
  losses: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export const players = pgTable("players", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email"),
  teamId: varchar("team_id").notNull(),
  jerseyNumber: integer("jersey_number"),
  position: text("position"),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").notNull(),
  team1Id: varchar("team1_id").notNull(),
  team2Id: varchar("team2_id").notNull(),
  team1Score: integer("team1_score").notNull().default(0),
  team2Score: integer("team2_score").notNull().default(0),
  round: text("round").notNull(),
  status: text("status").notNull().default('scheduled'),
  winnerId: varchar("winner_id"),
  mvpId: varchar("mvp_id"),
  courtNumber: text("court_number"),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  team1Score: true,
  team2Score: true,
  winnerId: true,
  mvpId: true,
});

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export const matchStats = pgTable("match_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull(),
  playerId: varchar("player_id").notNull(),
  points: integer("points").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  rebounds: integer("rebounds").notNull().default(0),
});

export const insertMatchStatsSchema = createInsertSchema(matchStats).omit({
  id: true,
});

export type InsertMatchStats = z.infer<typeof insertMatchStatsSchema>;
export type MatchStats = typeof matchStats.$inferSelect;

export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  teams: many(teams),
  matches: many(matches),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id],
  }),
  players: many(players),
  matchesAsTeam1: many(matches, { relationName: "team1" }),
  matchesAsTeam2: many(matches, { relationName: "team2" }),
}));

export const playersRelations = relations(players, ({ one, many }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
  matchStats: many(matchStats),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [matches.tournamentId],
    references: [tournaments.id],
  }),
  team1: one(teams, {
    fields: [matches.team1Id],
    references: [teams.id],
    relationName: "team1",
  }),
  team2: one(teams, {
    fields: [matches.team2Id],
    references: [teams.id],
    relationName: "team2",
  }),
  winner: one(teams, {
    fields: [matches.winnerId],
    references: [teams.id],
  }),
  mvp: one(players, {
    fields: [matches.mvpId],
    references: [players.id],
  }),
  stats: many(matchStats),
}));

export const matchStatsRelations = relations(matchStats, ({ one }) => ({
  match: one(matches, {
    fields: [matchStats.matchId],
    references: [matches.id],
  }),
  player: one(players, {
    fields: [matchStats.playerId],
    references: [players.id],
  }),
}));

// Merchandise Module Schemas
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  image: text("image"),
  inStock: integer("in_stock").notNull().default(1),
  createdAt: text("created_at").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  items: text("items").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default('pending'),
  createdAt: text("created_at").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Court Module Schemas
export const courts = pgTable("courts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  university: text("university"),
  city: text("city").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  availability: text("availability").notNull().default('available'),
  contactInfo: text("contact_info"),
  sponsorVisibility: integer("sponsor_visibility").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const insertCourtSchema = createInsertSchema(courts).omit({
  id: true,
  createdAt: true,
});

export type InsertCourt = z.infer<typeof insertCourtSchema>;
export type Court = typeof courts.$inferSelect;

// Media Module Schemas
export const media = pgTable("media", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  tournamentId: varchar("tournament_id"),
  teamId: varchar("team_id"),
  sponsorId: varchar("sponsor_id"),
  tags: text("tags"),
  uploadedBy: varchar("uploaded_by"),
  createdAt: text("created_at").notNull(),
});

export const insertMediaSchema = createInsertSchema(media).omit({
  id: true,
  createdAt: true,
});

export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type Media = typeof media.$inferSelect;

// Sponsor Module Schemas
export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").notNull().default('new'),
  createdAt: text("created_at").notNull(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export const brandAssets = pgTable("brand_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sponsorId: varchar("sponsor_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertBrandAssetSchema = createInsertSchema(brandAssets).omit({
  id: true,
  createdAt: true,
});

export type InsertBrandAsset = z.infer<typeof insertBrandAssetSchema>;
export type BrandAsset = typeof brandAssets.$inferSelect;
