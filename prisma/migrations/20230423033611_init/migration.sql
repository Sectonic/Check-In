-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Organizer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "orgId" INTEGER,
    CONSTRAINT "Organizer_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Meet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "reoccurance" BOOLEAN NOT NULL DEFAULT true,
    "qr" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "organizerId" INTEGER NOT NULL,
    CONSTRAINT "Meet_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "manual" BOOLEAN NOT NULL DEFAULT false,
    "tag" TEXT,
    "qr" BOOLEAN NOT NULL DEFAULT false,
    "meetId" INTEGER NOT NULL,
    CONSTRAINT "Event_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "specificId" TEXT NOT NULL,
    "meetId" INTEGER NOT NULL,
    CONSTRAINT "Attendee_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "multiple" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "eventId" INTEGER NOT NULL,
    CONSTRAINT "Option_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Selection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "optionId" INTEGER NOT NULL,
    CONSTRAINT "Selection_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attendeeId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "submitted" INTEGER NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT false,
    "hours" INTEGER NOT NULL,
    CONSTRAINT "Attendance_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attendanceId" INTEGER NOT NULL,
    "response" TEXT NOT NULL,
    "optionId" INTEGER NOT NULL,
    CONSTRAINT "Answer_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
