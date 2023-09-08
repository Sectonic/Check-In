/*
  Warnings:

  - Added the required column `name` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speicifcId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Attendance` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `specificId` VARCHAR(191) NOT NULL;
