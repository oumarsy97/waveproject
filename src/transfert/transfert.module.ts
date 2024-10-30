import { Module } from '@nestjs/common';

import { TransfertService } from './transfert.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransfertController } from './transfert.controller';

@Module({
  imports: [
    PrismaModule,
    
  ],
  providers: [TransfertService,PrismaService],
  controllers: [ TransfertController],
  exports: [TransfertService],
})
export class TransfertModule {}
