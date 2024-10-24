-- CreateEnum
CREATE TYPE "Type" AS ENUM ('DEPOT', 'RETRAIT');

-- CreateEnum
CREATE TYPE "StatutTransaction" AS ENUM ('EN_ATTENTE', 'COMPLETEE', 'ANNULEE', 'ECHEC');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('TRANSACTION', 'SECURITE', 'COMPTE', 'PROMOTION');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "telephone" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "montant" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT,
    "estVerifie" BOOLEAN NOT NULL DEFAULT false,
    "limiteMensuelle" INTEGER NOT NULL DEFAULT 1000000,
    "derniereConnexion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactFrequent" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "telephone" TEXT NOT NULL,
    "nombreTransactions" INTEGER NOT NULL DEFAULT 1,
    "dernierTransfert" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montantTotal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactFrequent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionConnexion" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "appareil" TEXT NOT NULL,
    "localisation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionConnexion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Code" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "idClient" INTEGER NOT NULL,
    "tentatives" INTEGER NOT NULL DEFAULT 0,
    "estBloque" BOOLEAN NOT NULL DEFAULT false,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "montant" INTEGER NOT NULL DEFAULT 0,
    "code" INTEGER NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategorie" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfert" (
    "id" SERIAL NOT NULL,
    "idEmeteur" INTEGER NOT NULL,
    "idRecepteur" INTEGER NOT NULL,
    "montant" INTEGER NOT NULL,
    "statut" "StatutTransaction" NOT NULL DEFAULT 'EN_ATTENTE',
    "reference" TEXT NOT NULL,
    "frais" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "addresse" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "montant" INTEGER NOT NULL DEFAULT 0,
    "code" INTEGER NOT NULL,
    "tauxCommission" DOUBLE PRECISION NOT NULL DEFAULT 0.02,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "montant" INTEGER NOT NULL,
    "idOperateur" INTEGER NOT NULL,
    "idClient" INTEGER NOT NULL,
    "reference" TEXT NOT NULL,
    "statut" "StatutTransaction" NOT NULL DEFAULT 'EN_ATTENTE',
    "type" "Type" NOT NULL DEFAULT 'DEPOT',
    "frais" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credit" (
    "id" SERIAL NOT NULL,
    "montant" INTEGER NOT NULL,
    "idClient" INTEGER NOT NULL,
    "telephone" TEXT NOT NULL,
    "statut" "StatutTransaction" NOT NULL DEFAULT 'EN_ATTENTE',
    "reference" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "TypeNotification" NOT NULL,
    "estLue" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ServiceToServiceCategorie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_telephone_key" ON "Client"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ContactFrequent_clientId_telephone_key" ON "ContactFrequent"("clientId", "telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Service_telephone_key" ON "Service"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Transfert_reference_key" ON "Transfert"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Operateur_telephone_key" ON "Operateur"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "Transaction"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Credit_reference_key" ON "Credit"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "_ServiceToServiceCategorie_AB_unique" ON "_ServiceToServiceCategorie"("A", "B");

-- CreateIndex
CREATE INDEX "_ServiceToServiceCategorie_B_index" ON "_ServiceToServiceCategorie"("B");

-- AddForeignKey
ALTER TABLE "ContactFrequent" ADD CONSTRAINT "ContactFrequent_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionConnexion" ADD CONSTRAINT "SessionConnexion_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfert" ADD CONSTRAINT "Transfert_idEmeteur_fkey" FOREIGN KEY ("idEmeteur") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfert" ADD CONSTRAINT "Transfert_idRecepteur_fkey" FOREIGN KEY ("idRecepteur") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_idOperateur_fkey" FOREIGN KEY ("idOperateur") REFERENCES "Operateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credit" ADD CONSTRAINT "Credit_idClient_fkey" FOREIGN KEY ("idClient") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToServiceCategorie" ADD CONSTRAINT "_ServiceToServiceCategorie_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceToServiceCategorie" ADD CONSTRAINT "_ServiceToServiceCategorie_B_fkey" FOREIGN KEY ("B") REFERENCES "ServiceCategorie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
