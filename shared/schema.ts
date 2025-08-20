import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("resident"),
  department: varchar("department").default("pulmonary"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ward types
export const wardTypeEnum = pgEnum("ward_type", ["ICU", "Non-ICU", "TB Wing", "Backside"]);

// Wards table
export const wards = pgTable("wards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: wardTypeEnum("type").notNull(),
  totalBeds: integer("total_beds").notNull(),
  occupiedBeds: integer("occupied_beds").default(0),
  color: varchar("color").notNull(), // ward-red, ward-blue, ward-green, ward-orange
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patients table
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().unique(), // Hospital patient ID
  name: varchar("name").notNull(),
  age: integer("age"),
  gender: varchar("gender"),
  diagnosis: text("diagnosis"),
  currentWardId: varchar("current_ward_id").references(() => wards.id),
  bedNumber: varchar("bed_number"),
  admissionDate: timestamp("admission_date").defaultNow(),
  status: varchar("status").default("active"), // active, discharged, transferred
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Patient transfers table
export const patientTransfers = pgTable("patient_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  fromWardId: varchar("from_ward_id").references(() => wards.id),
  toWardId: varchar("to_ward_id").notNull().references(() => wards.id),
  reason: text("reason"),
  handoverNotes: text("handover_notes"),
  requestedById: varchar("requested_by_id").notNull().references(() => users.id),
  approvedById: varchar("approved_by_id").references(() => users.id),
  status: varchar("status").default("pending"), // pending, approved, completed, cancelled
  requestedAt: timestamp("requested_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medical reports table
export const medicalReports = pgTable("medical_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  reportType: varchar("report_type").notNull(), // biopsy, bronchoscopy, thoracoscopy, fnac
  title: varchar("title").notNull(),
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fileSize: integer("file_size"),
  uploadedById: varchar("uploaded_by_id").notNull().references(() => users.id),
  status: varchar("status").default("pending"), // pending, reviewed, approved
  reviewedById: varchar("reviewed_by_id").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Report comments table
export const reportComments = pgTable("report_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportId: varchar("report_id").notNull().references(() => medicalReports.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medical equipment table
export const medicalEquipment = pgTable("medical_equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // ventilator, monitor, oxygen_system
  wardId: varchar("ward_id").references(() => wards.id),
  status: varchar("status").default("operational"), // operational, maintenance, offline
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Procedures table
export const procedures = pgTable("procedures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  procedureType: varchar("procedure_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  performedById: varchar("performed_by_id").references(() => users.id),
  status: varchar("status").default("scheduled"), // scheduled, in_progress, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // emergency, info, warning, success
  isRead: boolean("is_read").default(false),
  relatedId: varchar("related_id"), // ID of related entity (patient, transfer, etc.)
  relatedType: varchar("related_type"), // patient, transfer, report, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// CME events table
export const cmeEvents = pgTable("cme_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  location: varchar("location"),
  organizedById: varchar("organized_by_id").notNull().references(() => users.id),
  maxAttendees: integer("max_attendees"),
  createdAt: timestamp("created_at").defaultNow(),
});

// CME attendance votes table
export const cmeVotes = pgTable("cme_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => cmeEvents.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  willAttend: boolean("will_attend").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Journal articles table
export const journalArticles = pgTable("journal_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  authors: text("authors"),
  journal: varchar("journal"),
  publishedDate: timestamp("published_date"),
  doi: varchar("doi"),
  summary: text("summary"),
  fileUrl: varchar("file_url"),
  sharedById: varchar("shared_by_id").notNull().references(() => users.id),
  tags: text("tags"), // JSON array of tags
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  recipientId: varchar("recipient_id").references(() => users.id),
  isGroupMessage: boolean("is_group_message").default(false),
  subject: varchar("subject"),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  parentMessageId: varchar("parent_message_id").references(() => messages.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  patientsAdmitted: many(patients),
  transfersRequested: many(patientTransfers, { relationName: "requestedTransfers" }),
  transfersApproved: many(patientTransfers, { relationName: "approvedTransfers" }),
  reportsUploaded: many(medicalReports, { relationName: "uploadedReports" }),
  reportsReviewed: many(medicalReports, { relationName: "reviewedReports" }),
  reportComments: many(reportComments),
  procedures: many(procedures),
  notifications: many(notifications),
  cmeEventsOrganized: many(cmeEvents),
  cmeVotes: many(cmeVotes),
  journalArticles: many(journalArticles),
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
}));

export const wardsRelations = relations(wards, ({ many }) => ({
  patients: many(patients),
  equipment: many(medicalEquipment),
  transfersFrom: many(patientTransfers, { relationName: "fromWard" }),
  transfersTo: many(patientTransfers, { relationName: "toWard" }),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  currentWard: one(wards, {
    fields: [patients.currentWardId],
    references: [wards.id],
  }),
  transfers: many(patientTransfers),
  reports: many(medicalReports),
  procedures: many(procedures),
}));

export const patientTransfersRelations = relations(patientTransfers, ({ one }) => ({
  patient: one(patients, {
    fields: [patientTransfers.patientId],
    references: [patients.id],
  }),
  fromWard: one(wards, {
    fields: [patientTransfers.fromWardId],
    references: [wards.id],
    relationName: "fromWard",
  }),
  toWard: one(wards, {
    fields: [patientTransfers.toWardId],
    references: [wards.id],
    relationName: "toWard",
  }),
  requestedBy: one(users, {
    fields: [patientTransfers.requestedById],
    references: [users.id],
    relationName: "requestedTransfers",
  }),
  approvedBy: one(users, {
    fields: [patientTransfers.approvedById],
    references: [users.id],
    relationName: "approvedTransfers",
  }),
}));

export const medicalReportsRelations = relations(medicalReports, ({ one, many }) => ({
  patient: one(patients, {
    fields: [medicalReports.patientId],
    references: [patients.id],
  }),
  uploadedBy: one(users, {
    fields: [medicalReports.uploadedById],
    references: [users.id],
    relationName: "uploadedReports",
  }),
  reviewedBy: one(users, {
    fields: [medicalReports.reviewedById],
    references: [users.id],
    relationName: "reviewedReports",
  }),
  comments: many(reportComments),
}));

export const reportCommentsRelations = relations(reportComments, ({ one }) => ({
  report: one(medicalReports, {
    fields: [reportComments.reportId],
    references: [medicalReports.id],
  }),
  user: one(users, {
    fields: [reportComments.userId],
    references: [users.id],
  }),
}));

export const medicalEquipmentRelations = relations(medicalEquipment, ({ one }) => ({
  ward: one(wards, {
    fields: [medicalEquipment.wardId],
    references: [wards.id],
  }),
}));

export const proceduresRelations = relations(procedures, ({ one }) => ({
  patient: one(patients, {
    fields: [procedures.patientId],
    references: [patients.id],
  }),
  performedBy: one(users, {
    fields: [procedures.performedById],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const cmeEventsRelations = relations(cmeEvents, ({ one, many }) => ({
  organizedBy: one(users, {
    fields: [cmeEvents.organizedById],
    references: [users.id],
  }),
  votes: many(cmeVotes),
}));

export const cmeVotesRelations = relations(cmeVotes, ({ one }) => ({
  event: one(cmeEvents, {
    fields: [cmeVotes.eventId],
    references: [cmeEvents.id],
  }),
  user: one(users, {
    fields: [cmeVotes.userId],
    references: [users.id],
  }),
}));

export const journalArticlesRelations = relations(journalArticles, ({ one }) => ({
  sharedBy: one(users, {
    fields: [journalArticles.sharedById],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
  parentMessage: one(messages, {
    fields: [messages.parentMessageId],
    references: [messages.id],
  }),
  replies: many(messages),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWardSchema = createInsertSchema(wards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPatientTransferSchema = createInsertSchema(patientTransfers).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalReportSchema = createInsertSchema(medicalReports).omit({
  id: true,
  createdAt: true,
});

export const insertReportCommentSchema = createInsertSchema(reportComments).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalEquipmentSchema = createInsertSchema(medicalEquipment).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProcedureSchema = createInsertSchema(procedures).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertCmeEventSchema = createInsertSchema(cmeEvents).omit({
  id: true,
  createdAt: true,
});

export const insertCmeVoteSchema = createInsertSchema(cmeVotes).omit({
  id: true,
  createdAt: true,
});

export const insertJournalArticleSchema = createInsertSchema(journalArticles).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertWard = z.infer<typeof insertWardSchema>;
export type Ward = typeof wards.$inferSelect;

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertPatientTransfer = z.infer<typeof insertPatientTransferSchema>;
export type PatientTransfer = typeof patientTransfers.$inferSelect;

export type InsertMedicalReport = z.infer<typeof insertMedicalReportSchema>;
export type MedicalReport = typeof medicalReports.$inferSelect;

export type InsertReportComment = z.infer<typeof insertReportCommentSchema>;
export type ReportComment = typeof reportComments.$inferSelect;

export type InsertMedicalEquipment = z.infer<typeof insertMedicalEquipmentSchema>;
export type MedicalEquipment = typeof medicalEquipment.$inferSelect;

export type InsertProcedure = z.infer<typeof insertProcedureSchema>;
export type Procedure = typeof procedures.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertCmeEvent = z.infer<typeof insertCmeEventSchema>;
export type CmeEvent = typeof cmeEvents.$inferSelect;

export type InsertCmeVote = z.infer<typeof insertCmeVoteSchema>;
export type CmeVote = typeof cmeVotes.$inferSelect;

export type InsertJournalArticle = z.infer<typeof insertJournalArticleSchema>;
export type JournalArticle = typeof journalArticles.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
