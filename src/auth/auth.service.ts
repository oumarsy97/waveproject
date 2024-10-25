import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientsService } from '../clients/clients.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {}

  // Vérifier les informations d'identification et générer un token
  async validateClient(telephone: string, code: number) {
    const client = await this.clientsService.login(telephone, code.toString());
    if (!client) {
      throw new UnauthorizedException();
    }
    return client;
  }
  async login(client: { telephone: string; id: number }) {
    const payload = { telephone: client.telephone, sub: client.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
