/*
  Warnings:

  - You are about to drop the column `level` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `course` DROP COLUMN `level`,
    DROP COLUMN `thumbnail`;
