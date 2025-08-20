import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPatientTransferSchema, insertMedicalReportSchema, insertReportCommentSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and documents are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Ward routes
  app.get("/api/wards", isAuthenticated, async (req, res) => {
    try {
      const wards = await storage.getWards();
      res.json(wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
      res.status(500).json({ message: "Failed to fetch wards" });
    }
  });

  app.get("/api/wards/:id", isAuthenticated, async (req, res) => {
    try {
      const ward = await storage.getWard(req.params.id);
      if (!ward) {
        return res.status(404).json({ message: "Ward not found" });
      }
      res.json(ward);
    } catch (error) {
      console.error("Error fetching ward:", error);
      res.status(500).json({ message: "Failed to fetch ward" });
    }
  });

  // Patient routes
  app.get("/api/patients", isAuthenticated, async (req, res) => {
    try {
      const patients = await storage.getPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get("/api/patients/:id", isAuthenticated, async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  app.get("/api/wards/:wardId/patients", isAuthenticated, async (req, res) => {
    try {
      const patients = await storage.getPatientsByWard(req.params.wardId);
      res.json(patients);
    } catch (error) {
      console.error("Error fetching ward patients:", error);
      res.status(500).json({ message: "Failed to fetch ward patients" });
    }
  });

  // Patient transfer routes
  app.get("/api/transfers", isAuthenticated, async (req, res) => {
    try {
      const transfers = await storage.getPatientTransfers();
      res.json(transfers);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      res.status(500).json({ message: "Failed to fetch transfers" });
    }
  });

  app.get("/api/transfers/recent", isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const transfers = await storage.getRecentTransfers(limit);
      res.json(transfers);
    } catch (error) {
      console.error("Error fetching recent transfers:", error);
      res.status(500).json({ message: "Failed to fetch recent transfers" });
    }
  });

  app.post("/api/transfers", isAuthenticated, async (req: any, res) => {
    try {
      const transferData = insertPatientTransferSchema.parse({
        ...req.body,
        requestedById: req.user.claims.sub,
      });
      const transfer = await storage.createPatientTransfer(transferData);
      
      // Send WebSocket notification for new transfer
      broadcastToWard(transfer.toWardId!, {
        type: "transfer_request",
        data: transfer,
      });

      res.status(201).json(transfer);
    } catch (error) {
      console.error("Error creating transfer:", error);
      res.status(500).json({ message: "Failed to create transfer" });
    }
  });

  app.put("/api/transfers/:id", isAuthenticated, async (req: any, res) => {
    try {
      const updates = req.body;
      if (updates.status === "approved") {
        updates.approvedById = req.user.claims.sub;
      }
      if (updates.status === "completed") {
        updates.completedAt = new Date();
      }

      const transfer = await storage.updatePatientTransfer(req.params.id, updates);
      
      // Send WebSocket notification for transfer update
      broadcastToAll({
        type: "transfer_update",
        data: transfer,
      });

      res.json(transfer);
    } catch (error) {
      console.error("Error updating transfer:", error);
      res.status(500).json({ message: "Failed to update transfer" });
    }
  });

  // Medical reports routes
  app.get("/api/reports", isAuthenticated, async (req, res) => {
    try {
      const reports = await storage.getMedicalReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/pending", isAuthenticated, async (req, res) => {
    try {
      const reports = await storage.getMedicalReportsByStatus("pending");
      res.json(reports);
    } catch (error) {
      console.error("Error fetching pending reports:", error);
      res.status(500).json({ message: "Failed to fetch pending reports" });
    }
  });

  app.post("/api/reports", isAuthenticated, upload.single("file"), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const reportData = insertMedicalReportSchema.parse({
        ...req.body,
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileSize: req.file.size,
        uploadedById: req.user.claims.sub,
      });

      const report = await storage.createMedicalReport(reportData);
      
      // Create notification for pending report
      await storage.createNotification({
        userId: req.user.claims.sub,
        title: "Report Uploaded",
        message: `${reportData.reportType} report for patient ${reportData.patientId} has been uploaded`,
        type: "info",
      });

      res.status(201).json(report);
    } catch (error) {
      console.error("Error uploading report:", error);
      res.status(500).json({ message: "Failed to upload report" });
    }
  });

  app.get("/api/reports/:id/comments", isAuthenticated, async (req, res) => {
    try {
      const comments = await storage.getReportComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/reports/:id/comments", isAuthenticated, async (req: any, res) => {
    try {
      const commentData = insertReportCommentSchema.parse({
        reportId: req.params.id,
        userId: req.user.claims.sub,
        comment: req.body.comment,
      });

      const comment = await storage.createReportComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Medical equipment routes
  app.get("/api/equipment", isAuthenticated, async (req, res) => {
    try {
      const equipment = await storage.getMedicalEquipment();
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  // Procedures routes
  app.get("/api/procedures", isAuthenticated, async (req, res) => {
    try {
      if (req.query.date) {
        const date = new Date(req.query.date as string);
        const procedures = await storage.getProceduresByDate(date);
        res.json(procedures);
      } else {
        const procedures = await storage.getProcedures();
        res.json(procedures);
      }
    } catch (error) {
      console.error("Error fetching procedures:", error);
      res.status(500).json({ message: "Failed to fetch procedures" });
    }
  });

  app.get("/api/procedures/today", isAuthenticated, async (req, res) => {
    try {
      const today = new Date();
      const procedures = await storage.getProceduresByDate(today);
      res.json(procedures);
    } catch (error) {
      console.error("Error fetching today's procedures:", error);
      res.status(500).json({ message: "Failed to fetch today's procedures" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUnreadNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      res.status(500).json({ message: "Failed to fetch unread notifications" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.put("/api/notifications/read-all", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // CME routes
  app.get("/api/cme/events", isAuthenticated, async (req, res) => {
    try {
      const events = await storage.getCmeEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching CME events:", error);
      res.status(500).json({ message: "Failed to fetch CME events" });
    }
  });

  // Journal routes
  app.get("/api/journal/articles", isAuthenticated, async (req, res) => {
    try {
      const articles = await storage.getJournalArticles();
      res.json(articles);
    } catch (error) {
      console.error("Error fetching journal articles:", error);
      res.status(500).json({ message: "Failed to fetch journal articles" });
    }
  });

  // Messages routes
  app.get("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<string, Set<WebSocket>>();

  wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'join') {
          const { userId, wardId } = data;
          
          // Add client to user connections
          if (!clients.has(userId)) {
            clients.set(userId, new Set());
          }
          clients.get(userId)!.add(ws);
          
          // Store ward info on websocket
          (ws as any).userId = userId;
          (ws as any).wardId = wardId;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      // Remove client from all connections
      const userId = (ws as any).userId;
      if (userId && clients.has(userId)) {
        clients.get(userId)!.delete(ws);
        if (clients.get(userId)!.size === 0) {
          clients.delete(userId);
        }
      }
    });
  });

  // Helper functions for broadcasting
  global.broadcastToAll = (message: any) => {
    const messageString = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  };

  global.broadcastToWard = (wardId: string, message: any) => {
    const messageString = JSON.stringify(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && (client as any).wardId === wardId) {
        client.send(messageString);
      }
    });
  };

  global.broadcastToUser = (userId: string, message: any) => {
    if (clients.has(userId)) {
      const messageString = JSON.stringify(message);
      clients.get(userId)!.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageString);
        }
      });
    }
  };

  return httpServer;
}

// Global broadcast functions
function broadcastToAll(message: any) {
  if ((global as any).broadcastToAll) {
    (global as any).broadcastToAll(message);
  }
}

function broadcastToWard(wardId: string, message: any) {
  if ((global as any).broadcastToWard) {
    (global as any).broadcastToWard(wardId, message);
  }
}

function broadcastToUser(userId: string, message: any) {
  if ((global as any).broadcastToUser) {
    (global as any).broadcastToUser(userId, message);
  }
}
