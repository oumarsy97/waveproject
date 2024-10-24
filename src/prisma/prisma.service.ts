// src/prisma/prisma.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();  // Connectez-vous à la base de données lorsque le module est initialisé
  }

  async onModuleDestroy() {
    await this.$disconnect();  // Déconnectez-vous de la base de données lorsque le module est détruit
  }
}
