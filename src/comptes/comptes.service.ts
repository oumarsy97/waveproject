import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCompteDto } from './dto/create-compte.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompteDto } from './dto/update-compte.dto';
import * as jwt from 'jsonwebtoken'; // Import de jsonwebtoken pour décoder le token


@Injectable()
export class ComptesService {
  constructor(private prisma: PrismaService) {}

  create(createCompteDto: CreateCompteDto) {
    return this.prisma.compte.create({ data: createCompteDto });
  }

  // Récupération du compte à partir du token
  async findOneByToken(token: string) {
    try {
     
      // Décoder le token et récupérer l'ID du compte
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { sub: string };
      const id = decodedToken.sub;
      return await this.prisma.compte.findFirst({ where: { id: +id } });
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }

  findAll() {
    return  this.prisma.compte.findMany();
  }

  //others comptes client
  async findbyCompte(id: number) {
    return await this.prisma.compte.findMany({
      where: { NOT: { id }, AND: { type: 'CLIENT' } },
      include: {
        Client: {
          select: { 
            nom: true,
            prenom: true
          }, 
          take: 1 // Limiter le résultat à un seul client
        }
      },
    });
  }

  async findOne(id: number) {
    const compte = await this.prisma.compte.findFirst({
      where: { id },
      include: { Client: true },
    });
  
    return { ...compte, client: compte.Client[0] }; // Renomme la propriété Client en client
  }
  

  update(id: number, updateCompteDto: UpdateCompteDto) {
    return `This action updates a #${id} compte`;
  }

  remove(id: number) {
    return `This action removes a #${id} compte`;
  }
}
