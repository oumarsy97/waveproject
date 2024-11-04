import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';



@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}
  async create(createServiceDto: CreateServiceDto) {
    //creer le compte
    const compte = await this.prisma.compte.create({
      data: {
        ...createServiceDto,
        type: 'Service',
        limiteMensuelle:2000000,
        
      }
    })
      // Créer un qrcode pour le client
      const qrcode = await QRCode.toDataURL(`${compte.id}`);
      await this.prisma.compte.update({
        where: { id: compte.id },
        data: { qrcode },
      });
    //creer le service
    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        idCompte: +compte.id,
        
         
      }
    })

    
    
  }

  findAll() {
    return `This action returns all services`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
