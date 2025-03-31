/*
  Warnings:

  - You are about to drop the column `Description` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `Description`,
    ADD COLUMN `description` VARCHAR(255) NULL;
