// src/clients/clients.module.ts
import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SmsModule } from '../sms/sms.module';  // Ajoutez cette ligne

@Module({
  imports: [
    PrismaModule,
    SmsModule,    // Ajoutez cette ligne
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}