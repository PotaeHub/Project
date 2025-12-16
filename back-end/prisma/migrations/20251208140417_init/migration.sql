/*
  Warnings:

  - You are about to drop the column `status` on the `course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `course` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `enrollment` MODIFY `status` VARCHAR(191) NOT NULL;
