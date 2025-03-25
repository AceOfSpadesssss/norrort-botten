-- CreateTable
CREATE TABLE `GuildBlacklist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuildBlacklist_guildID_key`(`guildID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
