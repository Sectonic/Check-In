/*
  Warnings:

  - You are about to drop the column `manual` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `qr` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `manual` on the `Meet` table. All the data in the column will be lost.
  - You are about to drop the column `qr` on the `Meet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `manual`,
    DROP COLUMN `qr`;

-- AlterTable
ALTER TABLE `Meet` DROP COLUMN `manual`,
    DROP COLUMN `qr`,
    ADD COLUMN `inclusive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `trackAbsent` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `reoccurance` BOOLEAN NOT NULL DEFAULT false;
