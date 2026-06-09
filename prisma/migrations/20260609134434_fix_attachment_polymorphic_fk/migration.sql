-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "fk_attachment_daily_report";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "fk_attachment_issue";

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "issue_id" TEXT,
ADD COLUMN     "report_id" TEXT;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "daily_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
