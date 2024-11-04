import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientsService } from '../clients/clients.service';
import { SmsService } from '../sms/sms.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    private readonly prisma: PrismaService

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
    
    // Générer le token d'accès
    const access_token = this.jwtService.sign(payload);

    // Envoyer le code par SMS
    const smsCode = this.generateSmsCode(); // Générer un code SMS
    const code =await this.prisma.code.create({
      data: {
        code: smsCode,
        idCompte: client.id,
        expireAt: new Date(new Date().setDate(new Date().getDate() + 5))
      },
      
    })
    await this.smsService.sendSMS({to: client.telephone, text: `Votre code est ${code.code}. Ne le Partage à personne.Le code expirera dans 5 minutes`}); // Envoyer le SMS

    return {
      access_token,
  
    };
  }

  //logout
  async logout(client: { id: number }) {
    await this.prisma.code.deleteMany({
      where: {
        idCompte: client.id
      }
    })
  }

  // Fonction pour générer un code SMS aléatoire (ex. 4 chiffres)
  private generateSmsCode(): number {
    return Math.floor(1000 + Math.random() * 9000); // Génère un code entre 1000 et 9999
  }
}
