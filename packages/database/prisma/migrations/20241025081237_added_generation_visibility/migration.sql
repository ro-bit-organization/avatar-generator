-- CreateEnum
CREATE TYPE "GenerationVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "generations" ADD COLUMN     "visibility" "GenerationVisibility" NOT NULL DEFAULT 'PUBLIC';
