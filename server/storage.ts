import { 
  type User, 
  type InsertUser,
  type Tournament,
  type InsertTournament,
  type Team,
  type InsertTeam,
  type Player,
  type InsertPlayer,
  type Match,
  type InsertMatch,
  type MatchStats,
  type InsertMatchStats,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type Court,
  type InsertCourt,
  type CourtVisibilityLog,
  type InsertCourtVisibilityLog,
  type Media,
  type InsertMedia,
  type Inquiry,
  type InsertInquiry,
  type BrandAsset,
  type InsertBrandAsset,
  users,
  tournaments,
  teams,
  players,
  matches,
  matchStats,
  products,
  orders,
  courts,
  courtVisibilityLogs,
  media,
  inquiries,
  brandAssets
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getTournaments(): Promise<Tournament[]>;
  getTournament(id: string): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, tournament: Partial<Tournament>): Promise<Tournament | undefined>;
  deleteTournament(id: string): Promise<boolean>;

  getTeamsByTournament(tournamentId: string): Promise<Team[]>;
  getTeam(id: string): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, team: Partial<Team>): Promise<Team | undefined>;
  deleteTeam(id: string): Promise<boolean>;

  getPlayersByTeam(teamId: string): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, player: Partial<Player>): Promise<Player | undefined>;
  deletePlayer(id: string): Promise<boolean>;

  getMatchesByTournament(tournamentId: string): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, match: Partial<Match>): Promise<Match | undefined>;
  deleteMatch(id: string): Promise<boolean>;

  getMatchStatsByMatch(matchId: string): Promise<MatchStats[]>;
  createMatchStats(stats: InsertMatchStats): Promise<MatchStats>;
  updateMatchStats(id: string, stats: Partial<MatchStats>): Promise<MatchStats | undefined>;

  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;

  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;

  getCourts(): Promise<Court[]>;
  getCourt(id: string): Promise<Court | undefined>;
  createCourt(court: InsertCourt): Promise<Court>;
  updateCourt(id: string, court: Partial<Court>): Promise<Court | undefined>;
  getCourtVisibilityLogs(courtId: string): Promise<CourtVisibilityLog[]>;
  createCourtVisibilityLog(log: InsertCourtVisibilityLog): Promise<CourtVisibilityLog>;

  getMedia(): Promise<Media[]>;
  getMediaByTournament(tournamentId: string): Promise<Media[]>;
  getMediaItem(id: string): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;

  getInquiries(): Promise<Inquiry[]>;
  getInquiry(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, inquiry: Partial<Inquiry>): Promise<Inquiry | undefined>;

  getBrandAssets(sponsorId: string): Promise<BrandAsset[]>;
  createBrandAsset(asset: InsertBrandAsset): Promise<BrandAsset>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getTournaments(): Promise<Tournament[]> {
    return await db.select().from(tournaments);
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament || undefined;
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const [tournament] = await db
      .insert(tournaments)
      .values({
        ...insertTournament,
        createdAt: new Date().toISOString()
      })
      .returning();
    return tournament;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | undefined> {
    const [tournament] = await db
      .update(tournaments)
      .set(updates)
      .where(eq(tournaments.id, id))
      .returning();
    return tournament || undefined;
  }

  async deleteTournament(id: string): Promise<boolean> {
    const result = await db.delete(tournaments).where(eq(tournaments.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getTeamsByTournament(tournamentId: string): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.tournamentId, tournamentId));
  }

  async getTeam(id: string): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || undefined;
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db
      .insert(teams)
      .values(insertTeam)
      .returning();
    return team;
  }

  async updateTeam(id: string, updates: Partial<Team>): Promise<Team | undefined> {
    const [team] = await db
      .update(teams)
      .set(updates)
      .where(eq(teams.id, id))
      .returning();
    return team || undefined;
  }

  async deleteTeam(id: string): Promise<boolean> {
    const result = await db.delete(teams).where(eq(teams.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.teamId, teamId));
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player || undefined;
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db
      .insert(players)
      .values(insertPlayer)
      .returning();
    return player;
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<Player | undefined> {
    const [player] = await db
      .update(players)
      .set(updates)
      .where(eq(players.id, id))
      .returning();
    return player || undefined;
  }

  async deletePlayer(id: string): Promise<boolean> {
    const result = await db.delete(players).where(eq(players.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getMatchesByTournament(tournamentId: string): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.tournamentId, tournamentId));
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match || undefined;
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values(insertMatch)
      .returning();
    return match;
  }

  async updateMatch(id: string, updates: Partial<Match>): Promise<Match | undefined> {
    const [match] = await db
      .update(matches)
      .set(updates)
      .where(eq(matches.id, id))
      .returning();
    return match || undefined;
  }

  async deleteMatch(id: string): Promise<boolean> {
    const result = await db.delete(matches).where(eq(matches.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getMatchStatsByMatch(matchId: string): Promise<MatchStats[]> {
    return await db.select().from(matchStats).where(eq(matchStats.matchId, matchId));
  }

  async createMatchStats(insertStats: InsertMatchStats): Promise<MatchStats> {
    const [stats] = await db
      .insert(matchStats)
      .values(insertStats)
      .returning();
    return stats;
  }

  async updateMatchStats(id: string, updates: Partial<MatchStats>): Promise<MatchStats | undefined> {
    const [stats] = await db
      .update(matchStats)
      .set(updates)
      .where(eq(matchStats.id, id))
      .returning();
    return stats || undefined;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values({
        ...insertProduct,
        createdAt: new Date().toISOString()
      })
      .returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values({
        ...insertOrder,
        createdAt: new Date().toISOString()
      })
      .returning();
    return order;
  }

  async getCourts(): Promise<Court[]> {
    return await db.select().from(courts);
  }

  async getCourt(id: string): Promise<Court | undefined> {
    const [court] = await db.select().from(courts).where(eq(courts.id, id));
    return court || undefined;
  }

  async createCourt(insertCourt: InsertCourt): Promise<Court> {
    const [court] = await db
      .insert(courts)
      .values({
        ...insertCourt,
        createdAt: new Date().toISOString()
      })
      .returning();
    return court;
  }

  async updateCourt(id: string, updates: Partial<Court>): Promise<Court | undefined> {
    const [court] = await db
      .update(courts)
      .set(updates)
      .where(eq(courts.id, id))
      .returning();
    return court || undefined;
  }

  async getCourtVisibilityLogs(courtId: string): Promise<CourtVisibilityLog[]> {
    return await db
      .select()
      .from(courtVisibilityLogs)
      .where(eq(courtVisibilityLogs.courtId, courtId));
  }

  async createCourtVisibilityLog(insertLog: InsertCourtVisibilityLog): Promise<CourtVisibilityLog> {
    const [log] = await db
      .insert(courtVisibilityLogs)
      .values({
        ...insertLog,
        createdAt: new Date().toISOString()
      })
      .returning();
    return log;
  }

  async getMedia(): Promise<Media[]> {
    return await db.select().from(media);
  }

  async getMediaByTournament(tournamentId: string): Promise<Media[]> {
    return await db.select().from(media).where(eq(media.tournamentId, tournamentId));
  }

  async getMediaItem(id: string): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem || undefined;
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const [mediaItem] = await db
      .insert(media)
      .values({
        ...insertMedia,
        createdAt: new Date().toISOString()
      })
      .returning();
    return mediaItem;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries);
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry || undefined;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db
      .insert(inquiries)
      .values({
        ...insertInquiry,
        createdAt: new Date().toISOString()
      })
      .returning();
    return inquiry;
  }

  async updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry | undefined> {
    const [inquiry] = await db
      .update(inquiries)
      .set(updates)
      .where(eq(inquiries.id, id))
      .returning();
    return inquiry || undefined;
  }

  async getBrandAssets(sponsorId: string): Promise<BrandAsset[]> {
    return await db.select().from(brandAssets).where(eq(brandAssets.sponsorId, sponsorId));
  }

  async createBrandAsset(insertAsset: InsertBrandAsset): Promise<BrandAsset> {
    const [asset] = await db
      .insert(brandAssets)
      .values({
        ...insertAsset,
        createdAt: new Date().toISOString()
      })
      .returning();
    return asset;
  }
}

export const storage = new DatabaseStorage();
