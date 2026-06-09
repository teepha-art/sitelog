import { 
  Project, 
  DailyReport, 
  Issue, 
  MaterialRequest, 
  Notification,
  User,
  ProjectMembership,
  Attachment,
  Role,
  ProjectStatus,
  IssueStatus,
  Priority,
  RequestStatus,
  EntityType,
  NotificationType
} from '@prisma/client';

export type {
  Project,
  DailyReport,
  Issue,
  MaterialRequest,
  Notification,
  User,
  ProjectMembership,
  Attachment,
};

export {
  Role,
  ProjectStatus,
  IssueStatus,
  Priority,
  RequestStatus,
  EntityType,
  NotificationType,
};

// API Return Types
export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: { code: string; message: string } };

// Enriched Models
export type ProjectWithManager = Project & {
  manager: { id: string; fullName: string };
  _count?: {
    memberships: number;
  }
};

export type ReportWithSubmitter = DailyReport & {
  submitter: { id: string; fullName: string };
  attachments: Attachment[];
};

export type IssueWithRelations = Issue & {
  creator: { id: string; fullName: string };
  assignee: { id: string; fullName: string } | null;
  attachments: Attachment[];
};

export type MaterialRequestWithRelations = MaterialRequest & {
  requester: { id: string; fullName: string };
  approver: { id: string; fullName: string } | null;
  rejecter: { id: string; fullName: string } | null;
};
