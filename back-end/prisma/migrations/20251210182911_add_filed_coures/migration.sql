-- DropForeignKey
ALTER TABLE `course` DROP FOREIGN KEY `Course_teacherId_fkey`;

-- DropIndex
DROP INDEX `Course_teacherId_fkey` ON `course`;

-- AlterTable
ALTER TABLE `course` MODIFY `teacherId` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
