-- AlterTable
ALTER TABLE "users" ADD COLUMN     "removed_by_manager_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];
