/*
  Warnings:

  - Added the required column `organizerId` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specificId" TEXT NOT NULL,
    "organizerId" INTEGER NOT NULL,
    CONSTRAINT "Attendee_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attendee" ("id", "name", "specificId") SELECT "id", "name", "specificId" FROM "Attendee";
DROP TABLE "Attendee";
ALTER TABLE "new_Attendee" RENAME TO "Attendee";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
