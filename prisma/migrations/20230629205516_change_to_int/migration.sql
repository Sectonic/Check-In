/*
  Warnings:

  - You are about to alter the column `endTime` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `startTime` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attendeeId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "submitted" INTEGER NOT NULL,
    "hours" REAL NOT NULL,
    CONSTRAINT "Attendance_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attendance" ("attendeeId", "eventId", "hours", "id", "submitted") SELECT "attendeeId", "eventId", "hours", "id", "submitted" FROM "Attendance";
DROP TABLE "Attendance";
ALTER TABLE "new_Attendance" RENAME TO "Attendance";
CREATE TABLE "new_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "multiple" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "eventId" INTEGER NOT NULL,
    CONSTRAINT "Option_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Option" ("eventId", "id", "multiple", "order", "question", "required", "type") SELECT "eventId", "id", "multiple", "order", "question", "required", "type" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE TABLE "new_Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attendanceId" INTEGER NOT NULL,
    "response" TEXT NOT NULL,
    "optionId" INTEGER NOT NULL,
    CONSTRAINT "Answer_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Answer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("attendanceId", "id", "optionId", "response") SELECT "attendanceId", "id", "optionId", "response" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
CREATE TABLE "new_Attendee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specificId" TEXT NOT NULL,
    "organizerId" INTEGER NOT NULL,
    CONSTRAINT "Attendee_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attendee" ("id", "name", "organizerId", "specificId") SELECT "id", "name", "organizerId", "specificId" FROM "Attendee";
DROP TABLE "Attendee";
ALTER TABLE "new_Attendee" RENAME TO "Attendee";
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
    CONSTRAINT "Meet_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Meet" ("active", "endDict", "id", "image", "imageId", "manual", "name", "organizerId", "qr", "reoccurance", "scope", "startDict") SELECT "active", "endDict", "id", "image", "imageId", "manual", "name", "organizerId", "qr", "reoccurance", "scope", "startDict" FROM "Meet";
DROP TABLE "Meet";
ALTER TABLE "new_Meet" RENAME TO "Meet";
CREATE TABLE "new_Reoccurance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" INTEGER NOT NULL,
    "meetId" INTEGER NOT NULL,
    CONSTRAINT "Reoccurance_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Reoccurance" ("date", "id", "meetId") SELECT "date", "id", "meetId" FROM "Reoccurance";
DROP TABLE "Reoccurance";
ALTER TABLE "new_Reoccurance" RENAME TO "Reoccurance";
CREATE TABLE "new_Selection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "optionId" INTEGER NOT NULL,
    CONSTRAINT "Selection_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Selection" ("id", "optionId", "value") SELECT "id", "optionId", "value" FROM "Selection";
DROP TABLE "Selection";
ALTER TABLE "new_Selection" RENAME TO "Selection";
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "manual" BOOLEAN NOT NULL DEFAULT false,
    "tag" TEXT,
    "qr" BOOLEAN NOT NULL DEFAULT false,
    "meetId" INTEGER NOT NULL,
    CONSTRAINT "Event_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("endTime", "id", "manual", "meetId", "name", "qr", "startTime", "tag") SELECT "endTime", "id", "manual", "meetId", "name", "qr", "startTime", "tag" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
