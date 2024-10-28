import { Module } from '@nestjs/common';
import { ComptesService } from './comptes.service';
import { ComptesController } from './comptes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ComptesController],
  providers: [ComptesService],
})
export class ComptesModule {}
