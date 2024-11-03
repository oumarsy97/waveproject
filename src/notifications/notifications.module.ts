// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from '../prisma/prisma.service';
 
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [NotificationsService, NotificationsGateway, PrismaService],
  exports: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}