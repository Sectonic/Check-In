/*
  Warnings:

  - You are about to drop the column `active` on the `Meet` table. All the data in the column will be lost.
  - Added the required column `tardy` to the `Meet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Meet` DROP COLUMN `active`,
    ADD COLUMN `tardy` INTEGER NOT NULL;
