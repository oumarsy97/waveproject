import { Module } from '@nestjs/common';
import { CategorieservicesService } from './categorieservices.service';
import { CategorieservicesController } from './categorieservices.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CategorieservicesController],
  providers: [CategorieservicesService],
})
export class CategorieservicesModule {}
