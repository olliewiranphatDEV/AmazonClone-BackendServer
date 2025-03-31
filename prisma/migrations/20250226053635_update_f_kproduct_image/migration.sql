/*
  Warnings:

  - You are about to drop the column `productImage` on the `product` table. All the data in the column will be lost.
  - Added the required column `productID` to the `productImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `productImage`;

-- AlterTable
ALTER TABLE `productimage` ADD COLUMN `productID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `productImage` ADD CONSTRAINT `productImage_productID_fkey` FOREIGN KEY (`productID`) REFERENCES `Product`(`productID`) ON DELETE RESTRICT ON UPDATE CASCADE;
