-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "key" TEXT;
