-- CreateTable
CREATE TABLE "ForgotPassword" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPassword_id_key" ON "ForgotPassword"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPassword_email_key" ON "ForgotPassword"("email");
