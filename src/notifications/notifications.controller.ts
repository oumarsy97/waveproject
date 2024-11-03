import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiTags } from '@nestjs/swagger';
import { get } from 'http';

@Controller('notifications')
@ApiTags('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('unreadCount/:clientId')
  getUnreadCount(@Param('clientId') clientId: string) {
    return this.notificationsService.getUnreadCount(+clientId);
  }

  @Get('unread/:clientId')
  findAllByClientId(@Param('clientId') clientId: string) {
    return this.notificationsService.findAllByClientId(+clientId);
  }

  @Post()
  
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Get('markedRead/:clientId/:id')
  markAsRead(@Param('clientId') clientId: string, @Param('id') id: string) {
    console.log(clientId, id);
    return this.notificationsService.markAsRead(+id, +clientId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
