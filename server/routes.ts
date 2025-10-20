import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTournamentSchema,
  insertTeamSchema,
  insertPlayerSchema,
  insertMatchSchema,
  insertMatchStatsSchema
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

  const httpServer = createServer(app);

  return httpServer;
}
