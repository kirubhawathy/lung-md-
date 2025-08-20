import {
  users,
  wards,
  patients,
  patientTransfers,
  medicalReports,
  reportComments,
  medicalEquipment,
  procedures,
  notifications,
  cmeEvents,
  cmeVotes,
  journalArticles,
  messages,
  type User,
  type UpsertUser,
  type Ward,
  type InsertWard,
  type Patient,
  type InsertPatient,
  type PatientTransfer,
  type InsertPatientTransfer,
  type MedicalReport,
  type InsertMedicalReport,
  type ReportComment,
  type InsertReportComment,
  type MedicalEquipment,
  type InsertMedicalEquipment,
  type Procedure,
  type InsertProcedure,
  type Notification,
  type InsertNotification,
  type CmeEvent,
  type InsertCmeEvent,
  type CmeVote,
  type InsertCmeVote,
  type JournalArticle,
  type InsertJournalArticle,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Ward operations
  getWards(): Promise<Ward[]>;
  getWard(id: string): Promise<Ward | undefined>;
  createWard(ward: InsertWard): Promise<Ward>;
  updateWardOccupancy(wardId: string, occupiedBeds: number): Promise<Ward>;

  // Patient operations
  getPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientsByWard(wardId: string): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, updates: Partial<InsertPatient>): Promise<Patient>;

  // Patient transfer operations
  getPatientTransfers(): Promise<PatientTransfer[]>;
  getPatientTransfer(id: string): Promise<PatientTransfer | undefined>;
  getPatientTransfersByStatus(status: string): Promise<PatientTransfer[]>;
  createPatientTransfer(transfer: InsertPatientTransfer): Promise<PatientTransfer>;
  updatePatientTransfer(id: string, updates: Partial<InsertPatientTransfer>): Promise<PatientTransfer>;
  getRecentTransfers(limit?: number): Promise<PatientTransfer[]>;

  // Medical report operations
  getMedicalReports(): Promise<MedicalReport[]>;
  getMedicalReport(id: string): Promise<MedicalReport | undefined>;
  getMedicalReportsByPatient(patientId: string): Promise<MedicalReport[]>;
  getMedicalReportsByStatus(status: string): Promise<MedicalReport[]>;
  createMedicalReport(report: InsertMedicalReport): Promise<MedicalReport>;
  updateMedicalReport(id: string, updates: Partial<InsertMedicalReport>): Promise<MedicalReport>;

  // Report comment operations
  getReportComments(reportId: string): Promise<ReportComment[]>;
  createReportComment(comment: InsertReportComment): Promise<ReportComment>;

  // Medical equipment operations
  getMedicalEquipment(): Promise<MedicalEquipment[]>;
  getMedicalEquipmentByWard(wardId: string): Promise<MedicalEquipment[]>;
  createMedicalEquipment(equipment: InsertMedicalEquipment): Promise<MedicalEquipment>;
  updateMedicalEquipment(id: string, updates: Partial<InsertMedicalEquipment>): Promise<MedicalEquipment>;

  // Procedure operations
  getProcedures(): Promise<Procedure[]>;
  getProceduresByDate(date: Date): Promise<Procedure[]>;
  getProceduresByPatient(patientId: string): Promise<Procedure[]>;
  createProcedure(procedure: InsertProcedure): Promise<Procedure>;
  updateProcedure(id: string, updates: Partial<InsertProcedure>): Promise<Procedure>;

  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification>;
  markAllNotificationsAsRead(userId: string): Promise<void>;

  // CME operations
  getCmeEvents(): Promise<CmeEvent[]>;
  getCmeEvent(id: string): Promise<CmeEvent | undefined>;
  createCmeEvent(event: InsertCmeEvent): Promise<CmeEvent>;
  getCmeVotes(eventId: string): Promise<CmeVote[]>;
  createCmeVote(vote: InsertCmeVote): Promise<CmeVote>;
  updateCmeVote(eventId: string, userId: string, willAttend: boolean): Promise<CmeVote>;

  // Journal operations
  getJournalArticles(): Promise<JournalArticle[]>;
  getJournalArticle(id: string): Promise<JournalArticle | undefined>;
  createJournalArticle(article: InsertJournalArticle): Promise<JournalArticle>;

  // Message operations
  getMessages(userId: string): Promise<Message[]>;
  getConversation(userId1: string, userId2: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<Message>;

  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalPatients: number;
    icuPatients: number;
    procedures: number;
    pendingReports: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Ward operations
  async getWards(): Promise<Ward[]> {
    return await db.select().from(wards).orderBy(wards.name);
  }

  async getWard(id: string): Promise<Ward | undefined> {
    const [ward] = await db.select().from(wards).where(eq(wards.id, id));
    return ward;
  }

  async createWard(ward: InsertWard): Promise<Ward> {
    const [newWard] = await db.insert(wards).values(ward).returning();
    return newWard;
  }

  async updateWardOccupancy(wardId: string, occupiedBeds: number): Promise<Ward> {
    const [ward] = await db
      .update(wards)
      .set({ occupiedBeds, updatedAt: new Date() })
      .where(eq(wards.id, wardId))
      .returning();
    return ward;
  }

  // Patient operations
  async getPatients(): Promise<Patient[]> {
    return await db.select().from(patients).orderBy(desc(patients.admissionDate));
  }

  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async getPatientsByWard(wardId: string): Promise<Patient[]> {
    return await db
      .select()
      .from(patients)
      .where(and(eq(patients.currentWardId, wardId), eq(patients.status, "active")))
      .orderBy(patients.bedNumber);
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<InsertPatient>): Promise<Patient> {
    const [patient] = await db
      .update(patients)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();
    return patient;
  }

  // Patient transfer operations
  async getPatientTransfers(): Promise<PatientTransfer[]> {
    return await db.select().from(patientTransfers).orderBy(desc(patientTransfers.requestedAt));
  }

  async getPatientTransfer(id: string): Promise<PatientTransfer | undefined> {
    const [transfer] = await db.select().from(patientTransfers).where(eq(patientTransfers.id, id));
    return transfer;
  }

  async getPatientTransfersByStatus(status: string): Promise<PatientTransfer[]> {
    return await db
      .select()
      .from(patientTransfers)
      .where(eq(patientTransfers.status, status))
      .orderBy(desc(patientTransfers.requestedAt));
  }

  async createPatientTransfer(transfer: InsertPatientTransfer): Promise<PatientTransfer> {
    const [newTransfer] = await db.insert(patientTransfers).values(transfer).returning();
    return newTransfer;
  }

  async updatePatientTransfer(id: string, updates: Partial<InsertPatientTransfer>): Promise<PatientTransfer> {
    const [transfer] = await db
      .update(patientTransfers)
      .set(updates)
      .where(eq(patientTransfers.id, id))
      .returning();
    return transfer;
  }

  async getRecentTransfers(limit: number = 10): Promise<PatientTransfer[]> {
    return await db
      .select()
      .from(patientTransfers)
      .orderBy(desc(patientTransfers.requestedAt))
      .limit(limit);
  }

  // Medical report operations
  async getMedicalReports(): Promise<MedicalReport[]> {
    return await db.select().from(medicalReports).orderBy(desc(medicalReports.createdAt));
  }

  async getMedicalReport(id: string): Promise<MedicalReport | undefined> {
    const [report] = await db.select().from(medicalReports).where(eq(medicalReports.id, id));
    return report;
  }

  async getMedicalReportsByPatient(patientId: string): Promise<MedicalReport[]> {
    return await db
      .select()
      .from(medicalReports)
      .where(eq(medicalReports.patientId, patientId))
      .orderBy(desc(medicalReports.createdAt));
  }

  async getMedicalReportsByStatus(status: string): Promise<MedicalReport[]> {
    return await db
      .select()
      .from(medicalReports)
      .where(eq(medicalReports.status, status))
      .orderBy(desc(medicalReports.createdAt));
  }

  async createMedicalReport(report: InsertMedicalReport): Promise<MedicalReport> {
    const [newReport] = await db.insert(medicalReports).values(report).returning();
    return newReport;
  }

  async updateMedicalReport(id: string, updates: Partial<InsertMedicalReport>): Promise<MedicalReport> {
    const [report] = await db
      .update(medicalReports)
      .set(updates)
      .where(eq(medicalReports.id, id))
      .returning();
    return report;
  }

  // Report comment operations
  async getReportComments(reportId: string): Promise<ReportComment[]> {
    return await db
      .select()
      .from(reportComments)
      .where(eq(reportComments.reportId, reportId))
      .orderBy(reportComments.createdAt);
  }

  async createReportComment(comment: InsertReportComment): Promise<ReportComment> {
    const [newComment] = await db.insert(reportComments).values(comment).returning();
    return newComment;
  }

  // Medical equipment operations
  async getMedicalEquipment(): Promise<MedicalEquipment[]> {
    return await db.select().from(medicalEquipment).orderBy(medicalEquipment.name);
  }

  async getMedicalEquipmentByWard(wardId: string): Promise<MedicalEquipment[]> {
    return await db
      .select()
      .from(medicalEquipment)
      .where(eq(medicalEquipment.wardId, wardId))
      .orderBy(medicalEquipment.name);
  }

  async createMedicalEquipment(equipment: InsertMedicalEquipment): Promise<MedicalEquipment> {
    const [newEquipment] = await db.insert(medicalEquipment).values(equipment).returning();
    return newEquipment;
  }

  async updateMedicalEquipment(id: string, updates: Partial<InsertMedicalEquipment>): Promise<MedicalEquipment> {
    const [equipment] = await db
      .update(medicalEquipment)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(medicalEquipment.id, id))
      .returning();
    return equipment;
  }

  // Procedure operations
  async getProcedures(): Promise<Procedure[]> {
    return await db.select().from(procedures).orderBy(desc(procedures.scheduledDate));
  }

  async getProceduresByDate(date: Date): Promise<Procedure[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(procedures)
      .where(
        and(
          sql`${procedures.scheduledDate} >= ${startOfDay}`,
          sql`${procedures.scheduledDate} <= ${endOfDay}`
        )
      )
      .orderBy(procedures.scheduledDate);
  }

  async getProceduresByPatient(patientId: string): Promise<Procedure[]> {
    return await db
      .select()
      .from(procedures)
      .where(eq(procedures.patientId, patientId))
      .orderBy(desc(procedures.scheduledDate));
  }

  async createProcedure(procedure: InsertProcedure): Promise<Procedure> {
    const [newProcedure] = await db.insert(procedures).values(procedure).returning();
    return newProcedure;
  }

  async updateProcedure(id: string, updates: Partial<InsertProcedure>): Promise<Procedure> {
    const [procedure] = await db
      .update(procedures)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(procedures.id, id))
      .returning();
    return procedure;
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  }

  // CME operations
  async getCmeEvents(): Promise<CmeEvent[]> {
    return await db.select().from(cmeEvents).orderBy(desc(cmeEvents.eventDate));
  }

  async getCmeEvent(id: string): Promise<CmeEvent | undefined> {
    const [event] = await db.select().from(cmeEvents).where(eq(cmeEvents.id, id));
    return event;
  }

  async createCmeEvent(event: InsertCmeEvent): Promise<CmeEvent> {
    const [newEvent] = await db.insert(cmeEvents).values(event).returning();
    return newEvent;
  }

  async getCmeVotes(eventId: string): Promise<CmeVote[]> {
    return await db.select().from(cmeVotes).where(eq(cmeVotes.eventId, eventId));
  }

  async createCmeVote(vote: InsertCmeVote): Promise<CmeVote> {
    const [newVote] = await db.insert(cmeVotes).values(vote).returning();
    return newVote;
  }

  async updateCmeVote(eventId: string, userId: string, willAttend: boolean): Promise<CmeVote> {
    const [vote] = await db
      .update(cmeVotes)
      .set({ willAttend })
      .where(and(eq(cmeVotes.eventId, eventId), eq(cmeVotes.userId, userId)))
      .returning();
    return vote;
  }

  // Journal operations
  async getJournalArticles(): Promise<JournalArticle[]> {
    return await db.select().from(journalArticles).orderBy(desc(journalArticles.createdAt));
  }

  async getJournalArticle(id: string): Promise<JournalArticle | undefined> {
    const [article] = await db.select().from(journalArticles).where(eq(journalArticles.id, id));
    return article;
  }

  async createJournalArticle(article: InsertJournalArticle): Promise<JournalArticle> {
    const [newArticle] = await db.insert(journalArticles).values(article).returning();
    return newArticle;
  }

  // Message operations
  async getMessages(userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.recipientId, userId)))
      .orderBy(desc(messages.createdAt));
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.recipientId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.recipientId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: string): Promise<Message> {
    const [message] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalPatients: number;
    icuPatients: number;
    procedures: number;
    pendingReports: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalPatientsResult] = await db
      .select({ count: count() })
      .from(patients)
      .where(eq(patients.status, "active"));

    const [icuPatientsResult] = await db
      .select({ count: count() })
      .from(patients)
      .innerJoin(wards, eq(patients.currentWardId, wards.id))
      .where(and(eq(patients.status, "active"), eq(wards.type, "ICU")));

    const [proceduresResult] = await db
      .select({ count: count() })
      .from(procedures)
      .where(
        and(
          sql`${procedures.scheduledDate} >= ${today}`,
          sql`${procedures.scheduledDate} < ${tomorrow}`,
          eq(procedures.status, "scheduled")
        )
      );

    const [pendingReportsResult] = await db
      .select({ count: count() })
      .from(medicalReports)
      .where(eq(medicalReports.status, "pending"));

    return {
      totalPatients: totalPatientsResult.count,
      icuPatients: icuPatientsResult.count,
      procedures: proceduresResult.count,
      pendingReports: pendingReportsResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
