import { Injectable } from '@nestjs/common';
import { CreateCategorieserviceDto } from './dto/create-categorieservice.dto';
import { UpdateCategorieserviceDto } from './dto/update-categorieservice.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategorieservicesService {
  constructor(private prisma: PrismaService) {}
  create(createCategorieserviceDto: CreateCategorieserviceDto) {
    return  this.prisma.serviceCategorie.create({ data: createCategorieserviceDto });
  }

  findAll() {
    return this.prisma.serviceCategorie.findMany();
  }

  findOne(id: number) {
    return  this.prisma.serviceCategorie.findUnique({ where: { id } });
  }

  update(id: number, updateCategorieserviceDto: UpdateCategorieserviceDto) {
    return this.prisma.serviceCategorie.update({
      where: { id },
      data: updateCategorieserviceDto
    });
  }

  remove(id: number) {
    return this.prisma.serviceCategorie.delete({ where: { id } });
  }
}
