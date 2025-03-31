/*
  Warnings:

  - You are about to drop the column `userUserID` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_userUserID_fkey`;

-- DropIndex
DROP INDEX `Product_userUserID_fkey` ON `product`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `userUserID`,
    ADD COLUMN `userID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE SET NULL ON UPDATE CASCADE;
