import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTournamentSchema,
  insertTeamSchema,
  insertPlayerSchema,
  insertMatchSchema,
  insertMatchStatsSchema,
  insertProductSchema,
  insertOrderSchema,
  insertCourtSchema,
  insertCourtVisibilityLogSchema,
  insertMediaSchema,
  insertInquirySchema,
  insertBrandAssetSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Tournament Routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const validated = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(validated);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(400).json({ message: "Invalid tournament data" });
    }
  });

  app.patch("/api/tournaments/:id", async (req, res) => {
    try {
      const validated = insertTournamentSchema.partial().parse(req.body);
      const tournament = await storage.updateTournament(req.params.id, validated);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(400).json({ message: "Invalid tournament data" });
    }
  });

  app.delete("/api/tournaments/:id", async (req, res) => {
    try {
      const success = await storage.deleteTournament(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tournament" });
    }
  });

  // Team Routes
  app.get("/api/tournaments/:tournamentId/teams", async (req, res) => {
    try {
      const teams = await storage.getTeamsByTournament(req.params.tournamentId);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const validated = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validated);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ message: "Invalid team data" });
    }
  });

  app.patch("/api/teams/:id", async (req, res) => {
    try {
      const validated = insertTeamSchema.partial().parse(req.body);
      const team = await storage.updateTeam(req.params.id, validated);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(400).json({ message: "Invalid team data" });
    }
  });

  app.delete("/api/teams/:id", async (req, res) => {
    try {
      const success = await storage.deleteTeam(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team" });
    }
  });

  // Player Routes
  app.get("/api/teams/:teamId/players", async (req, res) => {
    try {
      const players = await storage.getPlayersByTeam(req.params.teamId);
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const player = await storage.getPlayer(req.params.id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch player" });
    }
  });

  app.post("/api/players", async (req, res) => {
    try {
      const validated = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(validated);
      res.status(201).json(player);
    } catch (error) {
      res.status(400).json({ message: "Invalid player data" });
    }
  });

  app.patch("/api/players/:id", async (req, res) => {
    try {
      const validated = insertPlayerSchema.partial().parse(req.body);
      const player = await storage.updatePlayer(req.params.id, validated);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(400).json({ message: "Invalid player data" });
    }
  });

  app.delete("/api/players/:id", async (req, res) => {
    try {
      const success = await storage.deletePlayer(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete player" });
    }
  });

  // Match Routes
  app.get("/api/tournaments/:tournamentId/matches", async (req, res) => {
    try {
      const matches = await storage.getMatchesByTournament(req.params.tournamentId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.get("/api/matches/:id", async (req, res) => {
    try {
      const match = await storage.getMatch(req.params.id);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch match" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const validated = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validated);
      res.status(201).json(match);
    } catch (error) {
      res.status(400).json({ message: "Invalid match data" });
    }
  });

  app.patch("/api/matches/:id", async (req, res) => {
    try {
      const allowedUpdates = req.body;
      delete allowedUpdates.id;
      delete allowedUpdates.tournamentId;
      delete allowedUpdates.team1Id;
      delete allowedUpdates.team2Id;
      const match = await storage.updateMatch(req.params.id, allowedUpdates);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: "Failed to update match" });
    }
  });

  app.delete("/api/matches/:id", async (req, res) => {
    try {
      const success = await storage.deleteMatch(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete match" });
    }
  });

  // Match Stats Routes
  app.get("/api/matches/:matchId/stats", async (req, res) => {
    try {
      const stats = await storage.getMatchStatsByMatch(req.params.matchId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch match stats" });
    }
  });

  app.post("/api/match-stats", async (req, res) => {
    try {
      const validated = insertMatchStatsSchema.parse(req.body);
      const stats = await storage.createMatchStats(validated);
      res.status(201).json(stats);
    } catch (error) {
      res.status(400).json({ message: "Invalid match stats data" });
    }
  });

  app.patch("/api/match-stats/:id", async (req, res) => {
    try {
      const allowedUpdates = req.body;
      delete allowedUpdates.id;
      delete allowedUpdates.matchId;
      delete allowedUpdates.playerId;
      const stats = await storage.updateMatchStats(req.params.id, allowedUpdates);
      if (!stats) {
        return res.status(404).json({ message: "Match stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to update match stats" });
    }
  });

  // Product Routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Order Routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validated = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validated);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Court Routes
  app.get("/api/courts", async (req, res) => {
    try {
      const courts = await storage.getCourts();
      res.json(courts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courts" });
    }
  });

  app.get("/api/courts/:id", async (req, res) => {
    try {
      const court = await storage.getCourt(req.params.id);
      if (!court) {
        return res.status(404).json({ message: "Court not found" });
      }
      res.json(court);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch court" });
    }
  });

  app.post("/api/courts", async (req, res) => {
    try {
      const validated = insertCourtSchema.parse(req.body);
      const court = await storage.createCourt(validated);
      res.status(201).json(court);
    } catch (error) {
      res.status(400).json({ message: "Invalid court data" });
    }
  });

  app.patch("/api/courts/:id", async (req, res) => {
    try {
      const validated = insertCourtSchema.partial().parse(req.body);
      const court = await storage.updateCourt(req.params.id, validated);
      if (!court) {
        return res.status(404).json({ message: "Court not found" });
      }
      res.json(court);
    } catch (error) {
      res.status(400).json({ message: "Invalid court data" });
    }
  });

  app.get("/api/courts/:id/visibility-logs", async (req, res) => {
    try {
      const logs = await storage.getCourtVisibilityLogs(req.params.id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch visibility logs" });
    }
  });

  app.post("/api/courts/:id/visibility-logs", async (req, res) => {
    try {
      const validated = insertCourtVisibilityLogSchema.parse({
        ...req.body,
        courtId: req.params.id
      });
      const log = await storage.createCourtVisibilityLog(validated);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid visibility log data" });
    }
  });

  // Media Routes
  app.get("/api/media", async (req, res) => {
    try {
      const { tournamentId } = req.query;
      if (tournamentId && typeof tournamentId === 'string') {
        const media = await storage.getMediaByTournament(tournamentId);
        return res.json(media);
      }
      const media = await storage.getMedia();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const mediaItem = await storage.getMediaItem(req.params.id);
      if (!mediaItem) {
        return res.status(404).json({ message: "Media not found" });
      }
      res.json(mediaItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.post("/api/media", async (req, res) => {
    try {
      const validated = insertMediaSchema.parse(req.body);
      const mediaItem = await storage.createMedia(validated);
      res.status(201).json(mediaItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid media data" });
    }
  });

  // Inquiry Routes
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const validated = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validated);
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

  app.patch("/api/inquiries/:id", async (req, res) => {
    try {
      const inquiry = await storage.updateInquiry(req.params.id, req.body);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  // Brand Assets Routes
  app.get("/api/brand-assets", async (req, res) => {
    try {
      const { sponsorId } = req.query;
      if (!sponsorId || typeof sponsorId !== 'string') {
        return res.status(400).json({ message: "sponsorId required" });
      }
      const assets = await storage.getBrandAssets(sponsorId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand assets" });
    }
  });

  app.post("/api/brand-assets", async (req, res) => {
    try {
      const validated = insertBrandAssetSchema.parse(req.body);
      const asset = await storage.createBrandAsset(validated);
      res.status(201).json(asset);
    } catch (error) {
      res.status(400).json({ message: "Invalid brand asset data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
