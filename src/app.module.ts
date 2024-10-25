import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';
import { CodesModule } from './codes/codes.module';
import { AuthModule } from './auth/auth.module';
import { ProtectedController } from './protected/protected.controller';

@Module({
  imports: [ClientsModule, PrismaModule, CodesModule, AuthModule],
  controllers: [AppController, ProtectedController],
  providers: [AppService],
})
export class AppModule {}
