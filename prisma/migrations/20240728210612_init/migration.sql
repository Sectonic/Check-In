-- CreateTable
CREATE TABLE "Organizer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "reoccurance" BOOLEAN NOT NULL DEFAULT false,
    "inclusive" BOOLEAN NOT NULL DEFAULT false,
    "tardy" INTEGER,
    "startDict" TEXT,
    "endDict" TEXT,
    "scope" TEXT,
    "trackAbsent" BOOLEAN NOT NULL DEFAULT true,
    "multipleSubmissions" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "imageId" TEXT,
    "organizerId" INTEGER NOT NULL,

    CONSTRAINT "Meet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reoccurance" (
    "id" SERIAL NOT NULL,
    "date" INTEGER NOT NULL,
    "meetId" INTEGER NOT NULL,

    CONSTRAINT "Reoccurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "multipleSubmissions" BOOLEAN NOT NULL DEFAULT false,
    "tag" TEXT,
    "meetId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "specificId" TEXT NOT NULL,
    "organizerId" INTEGER NOT NULL,

    CONSTRAINT "Attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "attendeeId" INTEGER,
    "name" TEXT NOT NULL,
    "specificId" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "eventId" INTEGER NOT NULL,
    "submitted" INTEGER NOT NULL DEFAULT 0,
    "hours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttendeeToMeet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AttendeeToMeet_AB_unique" ON "_AttendeeToMeet"("A", "B");

-- CreateIndex
CREATE INDEX "_AttendeeToMeet_B_index" ON "_AttendeeToMeet"("B");

-- AddForeignKey
ALTER TABLE "Meet" ADD CONSTRAINT "Meet_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reoccurance" ADD CONSTRAINT "Reoccurance_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendee" ADD CONSTRAINT "Attendee_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "Attendee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendeeToMeet" ADD CONSTRAINT "_AttendeeToMeet_A_fkey" FOREIGN KEY ("A") REFERENCES "Attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttendeeToMeet" ADD CONSTRAINT "_AttendeeToMeet_B_fkey" FOREIGN KEY ("B") REFERENCES "Meet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
