import { Module } from '@nestjs/common';
import { TransfertRecurrentService } from './transfert-recurent.service';
import { TransfertRecurrentController } from './transfert-recurent.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ TransfertRecurrentController],
  providers: [ TransfertRecurrentService],
})
export class TransfertRecurentModule {}
