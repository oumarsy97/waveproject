import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { PrismaModule } from './prisma/prisma.module';
import { CodesModule } from './codes/codes.module';
import { AuthModule } from './auth/auth.module';
import { ProtectedController } from './protected/protected.controller';
import { ComptesController } from './comptes/comptes.controller';
import { ComptesService } from './comptes/comptes.service';
import { ComptesModule } from './comptes/comptes.module';
import { SmsService } from './sms/sms.service';
import { SmsModule } from './sms/sms.module';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { TransfertModule } from './transfert/transfert.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransfertRecurentModule } from './transfert-recurent/transfert-recurent.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // Pour rendre ConfigModule global
    }),ClientsModule, PrismaModule, CodesModule, AuthModule, ComptesModule, SmsModule, TransactionModule, TransfertModule, TransfertRecurentModule, NotificationsModule],
  controllers: [AppController, ProtectedController, ComptesController],
  providers: [AppService, ClientsModule, ComptesService, SmsService],
}) 
export class AppModule {}
