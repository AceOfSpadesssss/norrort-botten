-- CreateTable
CREATE TABLE `GuildGeneralPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `logChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultEmbedColorHex` VARCHAR(191) NOT NULL DEFAULT '',
    `successEmbedColorHex` VARCHAR(191) NOT NULL DEFAULT '',
    `errorEmbedColorHex` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultEmbedColor` INTEGER NOT NULL DEFAULT 0,
    `successEmbedColor` INTEGER NOT NULL DEFAULT 0,
    `errorEmbedColor` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildModerationPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `modRoleIDs` VARCHAR(191) NOT NULL DEFAULT '',
    `embedColor` INTEGER NOT NULL DEFAULT 0,
    `logChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `banChannelText` VARCHAR(191) NOT NULL DEFAULT '',
    `banChannelImage` VARCHAR(191) NOT NULL DEFAULT '',
    `kickChannelText` VARCHAR(191) NOT NULL DEFAULT '',
    `kickChannelImage` VARCHAR(191) NOT NULL DEFAULT '',
    `timeoutChannelText` VARCHAR(191) NOT NULL DEFAULT '',
    `timeoutChannelImage` VARCHAR(191) NOT NULL DEFAULT '',
    `warnChannelText` VARCHAR(191) NOT NULL DEFAULT '',
    `warnChannelImage` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildWarn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `moderatorID` VARCHAR(191) NOT NULL,
    `moderatorTag` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildTicketConfig` (
    `guildID` VARCHAR(191) NOT NULL,
    `channelNameFormat` VARCHAR(191) NOT NULL DEFAULT 'ticket-{number}',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildTicketPanel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `guildID` VARCHAR(191) NOT NULL,
    `logChannelID` VARCHAR(191) NULL,
    `categoryID` VARCHAR(191) NULL,
    `supportRoleIDs` VARCHAR(191) NOT NULL DEFAULT '',
    `claimRoleIDs` VARCHAR(191) NOT NULL DEFAULT '',
    `pingRoleID` VARCHAR(191) NULL,
    `questions` VARCHAR(191) NULL,
    `emoji` VARCHAR(191) NOT NULL DEFAULT '✉️',
    `btnLabel` VARCHAR(191) NOT NULL DEFAULT 'Create Ticket',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildTicket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `ticketChannelID` VARCHAR(191) NOT NULL,
    `createdMemberID` VARCHAR(191) NOT NULL,
    `controlMessageID` VARCHAR(191) NOT NULL DEFAULT '',
    `claimedMemberID` VARCHAR(191) NULL,
    `panelID` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'open',

    INDEX `GuildTicket_panelID_fkey`(`panelID`),
    UNIQUE INDEX `GuildTicket_guildID_ticketChannelID_key`(`guildID`, `ticketChannelID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildTicketMember` (
    `ticketID` INTEGER NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ticketID`, `memberID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildApplicationPanel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `guildID` VARCHAR(191) NOT NULL,
    `createdMemberID` VARCHAR(191) NOT NULL,
    `approveLogChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `rejectLogChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `submissionChannelID` VARCHAR(191) NOT NULL,
    `placeholders` MEDIUMTEXT NOT NULL,
    `acceptMessage` VARCHAR(191) NULL,
    `rejectMessage` VARCHAR(191) NULL,
    `acceptEmbedImage` VARCHAR(191) NULL,
    `rejectEmbedImage` VARCHAR(191) NULL,
    `accessRoleIDs` VARCHAR(191) NOT NULL,
    `manageRoleIDs` VARCHAR(191) NULL,
    `giveRoleIDs` VARCHAR(191) NULL,
    `pingRoleID` VARCHAR(191) NULL,
    `emoji` VARCHAR(191) NOT NULL DEFAULT '✉️',
    `btnLabel` VARCHAR(191) NOT NULL DEFAULT 'Apply',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildApplicationPanelQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `panelID` INTEGER NOT NULL,
    `question` TEXT NOT NULL,
    `placeholder` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildApplicationSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `panelID` INTEGER NOT NULL,
    `submittedMemberID` VARCHAR(191) NOT NULL,
    `submittedMemberTag` VARCHAR(191) NOT NULL DEFAULT '',
    `submittedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `threadChannelID` VARCHAR(191) NULL,

    INDEX `GuildApplicationSubmission_panelID_fkey`(`panelID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildApplicationBlacklistedRole` (
    `guildID` VARCHAR(191) NOT NULL,
    `roleID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GlobalBanList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GlobalBanList_userID_key`(`userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildCustomCommand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `trigger` VARCHAR(191) NOT NULL,
    `commandID` VARCHAR(191) NOT NULL,
    `response` MEDIUMTEXT NOT NULL,

    UNIQUE INDEX `GuildCustomCommand_guildID_trigger_key`(`guildID`, `trigger`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildStickyMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `guildID` VARCHAR(191) NOT NULL,
    `channelIDs` VARCHAR(191) NOT NULL,
    `content` MEDIUMTEXT NOT NULL,

    UNIQUE INDEX `GuildStickyMessage_guildID_name_key`(`guildID`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildStickyMessageHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `channelID` VARCHAR(191) NOT NULL,
    `messageID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuildStickyMessageHistory_name_channelID_messageID_key`(`name`, `channelID`, `messageID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildSuggestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,
    `memberTag` VARCHAR(191) NOT NULL DEFAULT '',
    `fullIdea` VARCHAR(191) NOT NULL,
    `messageID` VARCHAR(191) NOT NULL,
    `threadID` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildSuggestionPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `suggestionChannelID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildWelcomePanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `welcomeChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `embedColor` INTEGER NOT NULL DEFAULT 0,
    `embedTitle` VARCHAR(191) NOT NULL DEFAULT '',
    `embedDescription` VARCHAR(191) NOT NULL DEFAULT '',
    `backgroundImage` VARCHAR(191) NOT NULL DEFAULT '',
    `pingMember` BOOLEAN NOT NULL DEFAULT true,
    `giveRoleIDs` VARCHAR(191) NULL,
    `avatarCircleColor` VARCHAR(191) NOT NULL DEFAULT '',
    `avatarCircleColorHex` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildGiveaway` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL,
    `numberOfWinners` INTEGER NOT NULL DEFAULT 1,
    `prize` VARCHAR(191) NOT NULL,
    `channelID` VARCHAR(191) NOT NULL,
    `messageID` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildGiveawayParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `giveawayID` INTEGER NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuildGiveawayParticipant_giveawayID_memberID_key`(`giveawayID`, `memberID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildPoll` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL DEFAULT '',
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `color` INTEGER NOT NULL DEFAULT 0,
    `duration` INTEGER NOT NULL DEFAULT 5000,
    `channelID` VARCHAR(191) NOT NULL DEFAULT '',
    `messageID` VARCHAR(191) NOT NULL DEFAULT '',
    `threadID` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildPollChoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emoji` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `pollID` INTEGER NOT NULL,

    INDEX `GuildPollChoice_pollID_fkey`(`pollID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildPollParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pollID` INTEGER NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,
    `choiceId` INTEGER NOT NULL,

    INDEX `GuildPollParticipant_choiceId_fkey`(`choiceId`),
    UNIQUE INDEX `GuildPollParticipant_pollID_choiceId_memberID_key`(`pollID`, `choiceId`, `memberID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildUserLevel` (
    `userId` VARCHAR(191) NOT NULL,
    `userTag` VARCHAR(191) NOT NULL DEFAULT '',
    `guildId` VARCHAR(191) NOT NULL,
    `messageCount` INTEGER NOT NULL DEFAULT 0,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 0,
    `lastUpdated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`, `guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildUserLevelPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `color` INTEGER NOT NULL DEFAULT 0,
    `alertChannelID` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildSnippet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,
    `memberTag` VARCHAR(191) NOT NULL DEFAULT '',
    `messageID` VARCHAR(191) NOT NULL,
    `threadID` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildSnippetPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `snippetChannelID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildReminder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,
    `channelID` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `duration` INTEGER NOT NULL,
    `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildReviewPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `reviewChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `allowedRoleIDs` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildMemberCurrentRoles` (
    `guildID` VARCHAR(191) NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,
    `roles` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`guildID`, `memberID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildMemberProfile` (
    `guildID` VARCHAR(191) NOT NULL,
    `memberID` VARCHAR(191) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `nextBirthday` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timezone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`guildID`, `memberID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildBirthdayPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `alertChannelID` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildAntiTagPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `antiTagRoleIDs` VARCHAR(191) NOT NULL DEFAULT '',
    `whitelistRoleIDs` VARCHAR(191) NOT NULL DEFAULT '',
    `antiTagMessage` VARCHAR(191) NOT NULL DEFAULT '{@user} {taggedUsers}',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildAltPreventionPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `minAccountAgeDays` INTEGER NOT NULL DEFAULT 14,
    `dmMessage` VARCHAR(191) NOT NULL DEFAULT 'Your account must be older than 14 days to join.',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildFormPanel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `guildID` VARCHAR(191) NOT NULL,
    `createdMemberID` VARCHAR(191) NOT NULL,
    `logChannelID` VARCHAR(191) NOT NULL,
    `submissionChannelID` VARCHAR(191) NOT NULL,
    `questions` VARCHAR(191) NOT NULL,
    `acceptMessage` VARCHAR(191) NULL,
    `rejectMessage` VARCHAR(191) NULL,
    `acceptEmbedImage` VARCHAR(191) NULL,
    `rejectEmbedImage` VARCHAR(191) NULL,
    `accessRoleIDs` VARCHAR(191) NOT NULL,
    `manageRoleIDs` VARCHAR(191) NULL,
    `giveRoleIDs` VARCHAR(191) NULL,
    `pingRoleID` VARCHAR(191) NULL,
    `emoji` VARCHAR(191) NOT NULL DEFAULT '?',
    `btnLabel` VARCHAR(191) NOT NULL DEFAULT 'Fill',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildFromSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `panelID` INTEGER NOT NULL,
    `submittedMemberID` VARCHAR(191) NOT NULL,
    `submittedMemberTag` VARCHAR(191) NOT NULL DEFAULT '',
    `submittedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `threadChannelID` VARCHAR(191) NULL,

    INDEX `GuildFromSubmission_panelID_fkey`(`panelID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildFormBlacklistedRole` (
    `guildID` VARCHAR(191) NOT NULL,
    `roleID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildSelfRolePanel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `guildID` VARCHAR(191) NOT NULL,
    `giveRoleIDs` VARCHAR(191) NOT NULL,
    `buttonLabel` VARCHAR(191) NOT NULL,
    `buttonEmoji` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuildSelfRolePanel_guildID_name_key`(`guildID`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildAdvancedLogsPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `textLogChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `voiceLogChannelID` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildRoleRequestPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `requestChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `managerRoleID` VARCHAR(191) NOT NULL DEFAULT '',
    `approveDmMessage` VARCHAR(191) NOT NULL DEFAULT '',
    `denyDmMessage` VARCHAR(191) NOT NULL DEFAULT '',
    `approveDmImage` VARCHAR(191) NOT NULL DEFAULT '',
    `denyDmImage` VARCHAR(191) NOT NULL DEFAULT '',
    `logChannelID` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildRoleRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requestMessageID` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `memberTag` VARCHAR(191) NOT NULL,
    `roleID` VARCHAR(191) NOT NULL,
    `roleName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildBotModule` (
    `guildID` VARCHAR(191) NOT NULL,
    `module` ENUM('ROLE_RECOVERY') NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`guildID`, `module`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildServerStatsPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `memberCountChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `userCountChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `channelCountChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `botCountChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `roleCountChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `memberCountLabel` VARCHAR(191) NOT NULL DEFAULT 'Member Count: {count}',
    `userCountLabel` VARCHAR(191) NOT NULL DEFAULT 'User Count: {count}',
    `channelCountLabel` VARCHAR(191) NOT NULL DEFAULT 'Channel Count: {count}',
    `botCountLabel` VARCHAR(191) NOT NULL DEFAULT 'Bot Count: {count}',
    `roleCountLabel` VARCHAR(191) NOT NULL DEFAULT 'Role Count: {count}',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildTempVoiceChannelPanel` (
    `guildID` VARCHAR(191) NOT NULL,
    `triggerChannelID` VARCHAR(191) NOT NULL DEFAULT '',
    `vcCategoryID` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`guildID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GuildTempVoiceChannel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guildID` VARCHAR(191) NOT NULL,
    `channelID` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GuildTempVoiceChannel_guildID_channelID_key`(`guildID`, `channelID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GuildTicket` ADD CONSTRAINT `GuildTicket_panelID_fkey` FOREIGN KEY (`panelID`) REFERENCES `GuildTicketPanel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildTicketMember` ADD CONSTRAINT `GuildTicketMember_ticketID_fkey` FOREIGN KEY (`ticketID`) REFERENCES `GuildTicket`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildApplicationPanelQuestion` ADD CONSTRAINT `GuildApplicationPanelQuestion_panelID_fkey` FOREIGN KEY (`panelID`) REFERENCES `GuildApplicationPanel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildApplicationSubmission` ADD CONSTRAINT `GuildApplicationSubmission_panelID_fkey` FOREIGN KEY (`panelID`) REFERENCES `GuildApplicationPanel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildGiveawayParticipant` ADD CONSTRAINT `GuildGiveawayParticipant_giveawayID_fkey` FOREIGN KEY (`giveawayID`) REFERENCES `GuildGiveaway`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildPollChoice` ADD CONSTRAINT `GuildPollChoice_pollID_fkey` FOREIGN KEY (`pollID`) REFERENCES `GuildPoll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildPollParticipant` ADD CONSTRAINT `GuildPollParticipant_choiceId_fkey` FOREIGN KEY (`choiceId`) REFERENCES `GuildPollChoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildPollParticipant` ADD CONSTRAINT `GuildPollParticipant_pollID_fkey` FOREIGN KEY (`pollID`) REFERENCES `GuildPoll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GuildFromSubmission` ADD CONSTRAINT `GuildFromSubmission_panelID_fkey` FOREIGN KEY (`panelID`) REFERENCES `GuildFormPanel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
