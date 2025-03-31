/*
  Warnings:

  - You are about to drop the column `sellerID` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `seller` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[merchantName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkID` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_sellerID_fkey`;

-- DropForeignKey
ALTER TABLE `seller` DROP FOREIGN KEY `Seller_userID_fkey`;

-- DropIndex
DROP INDEX `Product_sellerID_fkey` ON `product`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `totalPrice` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `sellerID`,
    ADD COLUMN `userUserID` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `birthday` DATE NULL,
    ADD COLUMN `clerkID` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` VARCHAR(255) NULL,
    ADD COLUMN `merchantName` VARCHAR(255) NULL,
    ADD COLUMN `sellerStatus` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    MODIFY `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updatedAt` TIMESTAMP(0) NOT NULL;

-- DropTable
DROP TABLE `seller`;

-- CreateIndex
CREATE UNIQUE INDEX `User_clerkID_key` ON `User`(`clerkID`);

-- CreateIndex
CREATE UNIQUE INDEX `User_merchantName_key` ON `User`(`merchantName`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userUserID_fkey` FOREIGN KEY (`userUserID`) REFERENCES `User`(`userID`) ON DELETE SET NULL ON UPDATE CASCADE;
