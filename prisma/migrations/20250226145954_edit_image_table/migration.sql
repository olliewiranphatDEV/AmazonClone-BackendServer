/*
  Warnings:

  - The primary key for the `productimage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageUrl` on the `productimage` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `productimage` table. All the data in the column will be lost.
  - Added the required column `imageID` to the `productImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productimage` DROP PRIMARY KEY,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `name`,
    ADD COLUMN `imageID` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `productImage` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`imageID`);
