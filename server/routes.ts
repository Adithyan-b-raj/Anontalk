import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      
      // Add user to online count if they have a session ID
      const sessionId = req.headers['x-session-id'] as string;
      if (sessionId) {
        await storage.addOnlineUser(sessionId);
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Get online user count
  app.get("/api/online-count", async (req, res) => {
    try {
      // Add user to online count if they have a session ID
      const sessionId = req.headers['x-session-id'] as string;
      if (sessionId) {
        await storage.addOnlineUser(sessionId);
      }
      
      const count = await storage.getOnlineUserCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to get online count" });
    }
  });

  // Create a new message
  app.post("/api/messages", async (req, res) => {
    try {
      // Add user to online count if they have a session ID
      const sessionId = req.headers['x-session-id'] as string;
      if (sessionId) {
        await storage.addOnlineUser(sessionId);
      }
      
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error: any) {
      if (error?.name === "ZodError") {
        res.status(400).json({ error: "Invalid message data" });
      } else {
        res.status(500).json({ error: "Failed to create message" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
