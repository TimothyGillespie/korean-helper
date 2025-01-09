-- CreateTable
CREATE TABLE "CommandUsage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "command" TEXT NOT NULL,
    "commandId" TEXT NOT NULL,
    "options" TEXT,
    "userId" TEXT NOT NULL,
    "guildId" TEXT,
    "channelId" TEXT,
    "success" BOOLEAN,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "CommandUsage_command_idx" ON "CommandUsage"("command");

-- CreateIndex
CREATE INDEX "CommandUsage_userId_idx" ON "CommandUsage"("userId");

-- CreateIndex
CREATE INDEX "CommandUsage_guildId_idx" ON "CommandUsage"("guildId");

-- CreateIndex
CREATE INDEX "CommandUsage_channelId_idx" ON "CommandUsage"("channelId");
