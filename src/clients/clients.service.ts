import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService, private readonly smsService: SmsService) {}

  // Méthode pour trouver un client par téléphone
  async findByTelephone(telephone: string) {
    return this.prisma.compte.findUnique({
      where: { telephone },
    });
  }

  // Méthode pour créer un nouveau client
  
  async create(createClientDto: CreateClientDto) {
    const { nom, prenom, code, telephone, email } = createClientDto;
   

    // Validation des champs
    if (!telephone || !code || !nom || !prenom || !email) {
      throw new BadRequestException('Tous les champs sont requis');
    }

    // Démarrer une transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      // Créer le compte
     
    // Créer le compte avec le QR code
    const compte = await this.prisma.compte.create({
      data: {
        telephone,
        code: await bcrypt.hash(code.toString(), 10),
        email,
      },
    });


      // Créer un qrcode pour le client
      const qrcode = await QRCode.toDataURL(`${compte.id}`);
      await prisma.compte.update({
        where: { id: compte.id },
        data: { qrcode },
      });

      // Créer le client
      const client = await prisma.client.create({
        data: {
          nom,
          prenom,
          idCompte: compte.id,
        },
      });

      // Créer un code pour le client
      const codeValidation = await prisma.code.create({
        data: {
          code: Math.floor(1000 + Math.random() * 9000),
          idCompte: client.id,
          expireAt: new Date(new Date().setDate(new Date().getDate() + 5)),
        },
      });

      // Envoyer le code par SMS
      await this.smsService.sendSMS({
        to: telephone,
        text: `Votre code est ${codeValidation.code}. Ne le Partage à personne. Le code expirera dans 5 minutes`,
      });

      return { ...client, ...compte };
    });

    return result;
  }


  // Méthode pour récupérer tous les clients
  findAll() {
    return this.prisma.client.findMany();
  }

  // Méthode pour récupérer un client par ID
  findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  // Méthode pour mettre à jour un client
  async update(id: number, updateClientDto: UpdateClientDto) {
    return this.prisma.compte.update({
      where: { id },
      data: {
        ...updateClientDto,
        code: updateClientDto.code ? await bcrypt.hash(updateClientDto.code.toString(), 10) : undefined,
      },
    });
  }

  // Méthode pour supprimer un client
  remove(id: number) {
    return this.prisma.client.delete({
      where: { id },
    });
  }

  // Méthode pour connecter un client
  async login(telephone: string, code: string) {
    const client = await this.prisma.compte.findUnique({
      where: { telephone },
    });
    
    if (!client) {
      throw new Error('Client non trouvé');
    }
    
    const isCodeValid = await bcrypt.compare(code, client.code);
    if (!isCodeValid) {
      throw new Error('Code invalide');
    }
    
    return client;
  }
}
