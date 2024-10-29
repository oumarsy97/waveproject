// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données existante
  await prisma.transaction.deleteMany({});

  const transactions = [
    {
      montant: 1000,
      idOperateur: 1,
      idClient: 1,
      type: 'DEPOT',
      createdAt: new Date('2024-01-01'),
    },
    {
      montant: 500,
      idOperateur: 1,
      idClient: 2,
      type: 'RETRAIT',
      createdAt: new Date('2024-01-02'),
    },
    {
      montant: 2000,
      idOperateur: 2,
      idClient: 1,
      type: 'DEPOT',
      createdAt: new Date('2024-01-03'),
    },
    {
      montant: 750,
      idOperateur: 2,
      idClient: 3,
      type: 'RETRAIT',
      createdAt: new Date('2024-01-04'),
    },
    {
      montant: 3000,
      idOperateur: 1,
      idClient: 2,
      type: 'DEPOT',
      createdAt: new Date('2024-01-05'),
    },
    {
      montant: 1500,
      idOperateur: 3,
      idClient: 1,
      type: 'RETRAIT',
      createdAt: new Date('2024-01-06'),

    },
    {
      montant: 4000,
      idOperateur: 2,
      idClient: 3,
      type: 'DEPOT',
      createdAt: new Date('2024-01-07'),
    },
    {
      montant: 2500,
      idOperateur: 1,
      idClient: 2,
      type: 'RETRAIT',
      createdAt: new Date('2024-01-08'),
    },
  ];

  for (let transaction of transactions) {
    let reference  = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    await prisma.transaction.create({
      data: {
        montant: transaction.montant,
        idOperateur: transaction.idOperateur,
        idClient: transaction.idClient,
        type: transaction.type === 'DEPOT' ? 'DEPOT' : 'RETRAIT',
        createdAt: transaction.createdAt,
        reference: reference,},
    });
  }

  console.log('Base de données alimentée avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });