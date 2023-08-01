/*
  Warnings:

  - You are about to drop the column `meetId` on the `Attendee` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_AttendeeToMeet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AttendeeToMeet_A_fkey" FOREIGN KEY ("A") REFERENCES "Attendee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AttendeeToMeet_B_fkey" FOREIGN KEY ("B") REFERENCES "Meet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attendee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specificId" TEXT NOT NULL
);
INSERT INTO "new_Attendee" ("id", "name", "specificId") SELECT "id", "name", "specificId" FROM "Attendee";
DROP TABLE "Attendee";
ALTER TABLE "new_Attendee" RENAME TO "Attendee";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_AttendeeToMeet_AB_unique" ON "_AttendeeToMeet"("A", "B");

-- CreateIndex
CREATE INDEX "_AttendeeToMeet_B_index" ON "_AttendeeToMeet"("B");
