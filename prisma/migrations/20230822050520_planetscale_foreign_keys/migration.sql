-- CreateTable
CREATE TABLE `Organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Organization_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organizer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `orgId` INTEGER NULL,

    INDEX `Organizer_orgId_idx`(`orgId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `reoccurance` BOOLEAN NOT NULL DEFAULT true,
    `startDict` VARCHAR(191) NULL,
    `endDict` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `manual` BOOLEAN NOT NULL DEFAULT false,
    `qr` BOOLEAN NOT NULL DEFAULT false,
    `image` VARCHAR(191) NULL,
    `imageId` VARCHAR(191) NULL,
    `organizerId` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Meet_organizerId_idx`(`organizerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reoccurance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` INTEGER NOT NULL,
    `meetId` INTEGER NOT NULL,

    INDEX `Reoccurance_meetId_idx`(`meetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `startTime` INTEGER NOT NULL,
    `endTime` INTEGER NOT NULL,
    `manual` BOOLEAN NOT NULL DEFAULT false,
    `tag` VARCHAR(191) NULL,
    `qr` BOOLEAN NOT NULL DEFAULT false,
    `meetId` INTEGER NOT NULL,

    INDEX `Event_meetId_idx`(`meetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `specificId` VARCHAR(191) NOT NULL,
    `organizerId` INTEGER NOT NULL,

    INDEX `Attendee_organizerId_idx`(`organizerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attendeeId` INTEGER NOT NULL,
    `eventId` INTEGER NOT NULL,
    `submitted` INTEGER NOT NULL,
    `hours` DOUBLE NOT NULL,

    INDEX `Attendance_attendeeId_idx`(`attendeeId`),
    INDEX `Attendance_eventId_idx`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttendeeToMeet` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AttendeeToMeet_AB_unique`(`A`, `B`),
    INDEX `_AttendeeToMeet_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
