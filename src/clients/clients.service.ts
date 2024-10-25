import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ClientsService {
  findByTelephone(telephone: string) {
      throw new Error('Method not implemented.');
  }
  constructor(private readonly prisma: PrismaService) {}

  // Création d'un client avec code chiffré
  async create(createClientDto: CreateClientDto) {
    const saltRounds = 10;

    // Chiffrement du code
    const hashedCode = await bcrypt.hash(createClientDto.code.toString(), saltRounds);

    return this.prisma.client.create({
      data: {
        telephone: createClientDto.telephone,
        prenom: createClientDto.prenom,
        nom: createClientDto.nom,
        code: hashedCode,
        email: createClientDto.email,
      },
    });
  }

  // Récupération de tous les clients
  findAll() {
    return this.prisma.client.findMany();
  }

  // Récupération d'un client par ID
  findOne(id: number) {
    return this.prisma.client.findUnique({
      where: {
        id,
      },
    });
  }

  // Mise à jour d'un client
  async update(id: number, updateClientDto: UpdateClientDto) {
    return this.prisma.client.update({
      where: {
        id,
      },
      data: {
        ...updateClientDto,
        code: updateClientDto.code ? await bcrypt.hash(updateClientDto.code.toString(), 10) : undefined,
      },
    });
  }
  // Suppression d'un client
  remove(id: number) {
    return this.prisma.client.delete({
      where: {
        id,
      },
    });
  }

  //login
  async login(telephone: string, code: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        telephone,
      },
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
