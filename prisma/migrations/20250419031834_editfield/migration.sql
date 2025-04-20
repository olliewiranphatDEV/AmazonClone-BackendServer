/*
  Warnings:

  - You are about to drop the column `productImage` on the `productimage` table. All the data in the column will be lost.
  - Added the required column `secure_url` to the `productimage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productimage` DROP COLUMN `productImage`,
    ADD COLUMN `secure_url` VARCHAR(255) NOT NULL;
