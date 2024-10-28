import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService, private readonly smsService: SmsService) {}
  
  findByTelephone(telephone: string) {
       
  }

  async create(createClientDto: CreateClientDto) {
    const { telephone, code, nom, prenom, email } = createClientDto;
    
    // Créer le compte
    const compte = await this.prisma.compte.create({
      data: {
        telephone,
        code: await bcrypt.hash(code.toString(), 10),
        email
      },
    });

    // Créer le client
    const client = await this.prisma.client.create({
      data: {
        nom,
        prenom,
        idCompte: compte.id
      },
    });

    // Créer un code pour le client
    const codeValidation = await this.prisma.code.create({
      data: {
        code: Math.floor(1000 + Math.random() * 9000),
        idCompte: client.id,
        expireAt: new Date(new Date().setDate(new Date().getDate() + 5))
      },
    });
    // Envoyer le SMS
    try { 
      await this.smsService.sendSMS({to: telephone, text: `Votre code de validation est ${codeValidation.code}. Ne le partagez à Personne.`});  // Pas besoin de passer des paramètres car ils sont déjà définis dans le service
      
      // Si vous voulez logger le succès
      console.log(`SMS envoyé avec succès au ${telephone}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS:', error);
      // Vous pouvez choisir de gérer l'erreur ici
      // throw new Error(`Erreur d'envoi SMS: ${error.message}`);
    }

    return { ...client, ...compte };
  }

  findAll() {
    return this.prisma.client.findMany();
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    return this.prisma.compte.update({
      where: { id },
      data: {
        ...updateClientDto,
        code: updateClientDto.code ? await bcrypt.hash(updateClientDto.code.toString(), 10) : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.client.delete({
      where: { id },
    });
  }

  async login(telephone: string, code: string) {
    const client = await this.prisma.compte.findUnique({
      where: { telephone },
    });
    
    if (!client) {
      throw new Error('Client not found');
    }
    
    const isCodeValid = await bcrypt.compare(code, client.code);
    if (!isCodeValid) {
      throw new Error('Invalid code');
    }
    
    return client;
  }
}