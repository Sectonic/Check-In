/*
  Warnings:

  - You are about to drop the column `present` on the `Attendance` table. All the data in the column will be lost.
  - You are about to alter the column `hours` on the `Attendance` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `endTime` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `BigInt`.
  - You are about to alter the column `startTime` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `BigInt`.

*/
-- CreateTable
CREATE TABLE "Reoccurance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" INTEGER NOT NULL,
    "meetId" INTEGER NOT NULL,
    CONSTRAINT "Reoccurance_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Meet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "reoccurance" BOOLEAN NOT NULL DEFAULT true,
    "startDict" TEXT,
    "endDict" TEXT,
    "scope" TEXT,
    "manual" BOOLEAN NOT NULL DEFAULT false,
    "qr" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "imageId" TEXT,
    "organizerId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Meet_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Meet" ("id", "image", "name", "organizerId", "qr", "reoccurance") SELECT "id", "image", "name", "organizerId", "qr", "reoccurance" FROM "Meet";
DROP TABLE "Meet";
ALTER TABLE "new_Meet" RENAME TO "Meet";
CREATE TABLE "new_Attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attendeeId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "submitted" INTEGER NOT NULL,
    "hours" REAL NOT NULL,
    CONSTRAINT "Attendance_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("attendeeId", "eventId", "hours", "id", "submitted") SELECT "attendeeId", "eventId", "hours", "id", "submitted" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startTime" BIGINT NOT NULL,
    "endTime" BIGINT NOT NULL,
    "manual" BOOLEAN NOT NULL DEFAULT false,
    "tag" TEXT,
    "qr" BOOLEAN NOT NULL DEFAULT false,
    "meetId" INTEGER NOT NULL,
    CONSTRAINT "Event_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("endTime", "id", "manual", "meetId", "name", "qr", "startTime", "tag") SELECT "endTime", "id", "manual", "meetId", "name", "qr", "startTime", "tag" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
