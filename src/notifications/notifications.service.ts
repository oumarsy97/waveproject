// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification, TypeNotification } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { isReadable } from 'stream';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(notoficationdta: CreateNotificationDto): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        clientId: notoficationdta.clientId,
        message: notoficationdta.message,
        titre: notoficationdta.titre,
        type: notoficationdta.type as TypeNotification,
       
      },
    });
  }

  async findAllByClientId(clientId: number): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {AND: [{clientId: clientId}, {estLue: false}]},
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: number, clientId: number): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id, clientId },
      data: { estLue: true },
    });
  }

  async getUnreadCount(clientId: number): Promise<number> {
    return this.prisma.notification.count({
      where: { clientId, estLue: false },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.notification.delete({ where: { id } });
  }
  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany();
  }

  async findOne(id: number): Promise<Notification> {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  
}