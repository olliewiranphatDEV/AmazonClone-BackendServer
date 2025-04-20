/*
  Warnings:

  - You are about to drop the column `userID` on the `product` table. All the data in the column will be lost.
  - The primary key for the `reviewpost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `sellerID` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_customerID_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_customerID_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryID_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_userID_fkey`;

-- DropForeignKey
ALTER TABLE `productimage` DROP FOREIGN KEY `productImage_productID_fkey`;

-- DropForeignKey
ALTER TABLE `productoncart` DROP FOREIGN KEY `ProductOnCart_cartID_fkey`;

-- DropForeignKey
ALTER TABLE `productoncart` DROP FOREIGN KEY `ProductOnCart_productID_fkey`;

-- DropForeignKey
ALTER TABLE `productonorder` DROP FOREIGN KEY `ProductOnOrder_orderID_fkey`;

-- DropForeignKey
ALTER TABLE `productonorder` DROP FOREIGN KEY `ProductOnOrder_productID_fkey`;

-- DropForeignKey
ALTER TABLE `reviewpost` DROP FOREIGN KEY `ReviewPost_customerID_fkey`;

-- DropForeignKey
ALTER TABLE `reviewpost` DROP FOREIGN KEY `ReviewPost_productID_fkey`;

-- DropForeignKey
ALTER TABLE `reviewpost` DROP FOREIGN KEY `ReviewPost_ratingID_fkey`;

-- DropIndex
DROP INDEX `Cart_customerID_fkey` ON `cart`;

-- DropIndex
DROP INDEX `Order_customerID_fkey` ON `order`;

-- DropIndex
DROP INDEX `Product_userID_fkey` ON `product`;

-- AlterTable
ALTER TABLE `cart` MODIFY `customerID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `customerID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `userID`,
    ADD COLUMN `sellerID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reviewpost` DROP PRIMARY KEY,
    MODIFY `customerID` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`customerID`, `productID`);

-- AlterTable
ALTER TABLE `user` MODIFY `firstName` VARCHAR(255) NULL,
    MODIFY `lastName` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `viewed` (
    `viewedID` INTEGER NOT NULL AUTO_INCREMENT,
    `customerID` VARCHAR(191) NOT NULL,
    `productID` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`viewedID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `viewed` ADD CONSTRAINT `viewed_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `user`(`clerkID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `viewed` ADD CONSTRAINT `viewed_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `category`(`categoryID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_sellerID_fkey` FOREIGN KEY (`sellerID`) REFERENCES `user`(`clerkID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productimage` ADD CONSTRAINT `productimage_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productoncart` ADD CONSTRAINT `productoncart_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productoncart` ADD CONSTRAINT `productoncart_cartID_fkey` FOREIGN KEY (`cartID`) REFERENCES `cart`(`cartID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `user`(`clerkID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `user`(`clerkID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productonorder` ADD CONSTRAINT `productonorder_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productonorder` ADD CONSTRAINT `productonorder_orderID_fkey` FOREIGN KEY (`orderID`) REFERENCES `order`(`orderID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviewpost` ADD CONSTRAINT `reviewpost_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `user`(`clerkID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviewpost` ADD CONSTRAINT `reviewpost_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `product`(`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviewpost` ADD CONSTRAINT `reviewpost_ratingID_fkey` FOREIGN KEY (`ratingID`) REFERENCES `rating`(`ratingID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_clerkID_key` TO `user_clerkID_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_merchantName_key` TO `user_merchantName_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_phoneNumber_key` TO `user_phoneNumber_key`;
