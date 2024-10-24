import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module'; // Importez PrismaModule
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

@Module({
  imports: [PrismaModule], // Importez PrismaModule ici
  providers: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
