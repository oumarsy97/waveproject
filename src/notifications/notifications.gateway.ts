// src/notifications/notifications.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    WsException,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { NotificationsService } from './notifications.service';
  import { JwtService } from '@nestjs/jwt';
  import { TypeNotification } from '@prisma/client';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    },
    namespace: '/notifications',
  })
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private clientSockets: Map<number, string[]> = new Map();
  
    constructor(
      private readonly notificationsService: NotificationsService,
      private readonly jwtService: JwtService,
    ) {}
  
    async handleConnection(client: Socket) {
      try {
        const token = client.handshake.auth.token;
        if (!token) {
          client.disconnect();
          return;
        }
  
        const decoded = this.jwtService.verify(token);
        const clientId = decoded.sub;
  
        const existingSockets = this.clientSockets.get(clientId) || [];
        this.clientSockets.set(clientId, [...existingSockets, client.id]);
  
        await client.join(`client-${clientId}`);
  
        // Envoyer les notifications existantes
        const notifications = await this.notificationsService.findAllByClientId(clientId);
        client.emit('notifications', notifications);
  
        // Envoyer le compteur de notifications non lues
        const unreadCount = await this.notificationsService.getUnreadCount(clientId);
        client.emit('unreadCount', unreadCount);
      } catch (error) {
        client.disconnect();
      }
    }
  
    handleDisconnect(client: Socket) {
      this.clientSockets.forEach((sockets, clientId) => {
        const updatedSockets = sockets.filter(id => id !== client.id);
        if (updatedSockets.length === 0) {
          this.clientSockets.delete(clientId);
        } else {
          this.clientSockets.set(clientId, updatedSockets);
        }
      });
    }
  
    @SubscribeMessage('markAsRead')
    async handleMarkAsRead(
      @ConnectedSocket() client: Socket,
      @MessageBody() payload: { notificationId: number }
    ) {
      try {
        // Validation du payload
        if (!payload || typeof payload.notificationId !== 'number') {
          throw new WsException('Invalid notification ID');
        }
    
        // Récupération et validation du clientId
        const clientId = this.getClientIdFromSocket(client);
        if (!clientId) {
          throw new WsException('Client not authenticated');
        }
    
        // Marquer comme lu et récupérer les données mises à jour
        await this.notificationsService.markAsRead(payload.notificationId, clientId);
        
        // Récupération des notifications mises à jour
        const [notifications, unreadCount] = await Promise.all([
          this.notificationsService.findAllByClientId(clientId),
          this.notificationsService.getUnreadCount(clientId)
        ]);
    
        // Émission des événements mis à jour
        const clientRoom = `client-${clientId}`;
        this.server.to(clientRoom).emit('notifications', notifications);
        this.server.to(clientRoom).emit('unreadCount', unreadCount);
    
        return { success: true };
      } catch (error) {
        // Gestion des erreurs
        client.emit('error', {
          event: 'markAsRead',
          message: error instanceof WsException ? error.message : 'Internal server error'
        });
        
        throw error;
      }
    }
    async sendNotificationToClient(data: {
      clientId: number;
      titre: string;
      message: string;
      type: TypeNotification;
    }) {
      // Créer la notification
      const notification = await this.notificationsService.create(data);
      console.log('notification', notification);
      
      // Envoyer au client
      this.server.to(`client-${data.clientId}`).emit('newNotification', notification);
      
      // Mettre à jour le compteur
      const unreadCount = await this.notificationsService.getUnreadCount(data.clientId);
      this.server.to(`client-${data.clientId}`).emit('unreadCount', unreadCount);
    }
  
    private getClientIdFromSocket(client: Socket): number | null {
      try {
        const token = client.handshake.auth.token;
        const decoded = this.jwtService.verify(token);
        return decoded.sub;
      } catch {
        return null;
      }
    }
  }
  