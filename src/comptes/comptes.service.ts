import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCompteDto } from './dto/create-compte.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompteDto } from './dto/update-compte.dto';
import * as jwt from 'jsonwebtoken'; // Import de jsonwebtoken pour décoder le token
import { log } from 'console';

@Injectable()
export class ComptesService {
  constructor(private prisma: PrismaService) {}

  create(createCompteDto: CreateCompteDto) {
    return 'This action adds a new compte';
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
    return `This action returns all comptes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} compte`;
  }

  update(id: number, updateCompteDto: UpdateCompteDto) {
    return `This action updates a #${id} compte`;
  }

  remove(id: number) {
    return `This action removes a #${id} compte`;
  }
}
