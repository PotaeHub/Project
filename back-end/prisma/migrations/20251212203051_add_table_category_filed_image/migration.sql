/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_key` ON `Category`(`name`);
