/*
  Warnings:

  - You are about to drop the column `productName` on the `product` table. All the data in the column will be lost.
  - Added the required column `productEngName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productThaiName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `productName`,
    ADD COLUMN `productEngName` VARCHAR(255) NOT NULL,
    ADD COLUMN `productThaiName` VARCHAR(255) NOT NULL;
