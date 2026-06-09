-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'assigned_to_project';
ALTER TYPE "NotificationType" ADD VALUE 'material_request_approved';
ALTER TYPE "NotificationType" ADD VALUE 'material_request_rejected';
ALTER TYPE "NotificationType" ADD VALUE 'material_request_fulfilled';
ALTER TYPE "NotificationType" ADD VALUE 'issue_assigned';
ALTER TYPE "NotificationType" ADD VALUE 'issue_resolved';
