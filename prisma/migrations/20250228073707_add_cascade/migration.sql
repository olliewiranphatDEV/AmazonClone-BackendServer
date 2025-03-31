/*
  Warnings:

  - You are about to drop the column `productEngName` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `productThaiName` on the `product` table. All the data in the column will be lost.
  - Added the required column `productName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_userID_fkey`;

-- DropForeignKey
ALTER TABLE `productimage` DROP FOREIGN KEY `productImage_productID_fkey`;

-- DropIndex
DROP INDEX `Product_userID_fkey` ON `product`;

-- DropIndex
DROP INDEX `productImage_productID_fkey` ON `productimage`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `productEngName`,
    DROP COLUMN `productThaiName`,
    ADD COLUMN `productName` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productImage` ADD CONSTRAINT `productImage_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `Product`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE;
