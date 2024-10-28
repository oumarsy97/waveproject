import { Injectable } from '@nestjs/common';
import { CreateCodeDto } from './dto/create-code.dto';
import { UpdateCodeDto } from './dto/update-code.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CodesService {
  constructor( private prisma: PrismaService) {}
  create(createCodeDto: CreateCodeDto) {

    return this.prisma.code.create({
      data: {
        code: createCodeDto.code,
        idCompte: createCodeDto.idCompte,
        expireAt: new Date( new Date().setDate( new Date().getDate() + 1 ) )
      }
    })

  
  }

  findAll() {
    return this.prisma.code.findMany();
  }

  findOne(id: number) {
    return this.prisma.code.findUnique({
      where: {
        id
      }
    })
  }

  update(id: number, updateCodeDto: UpdateCodeDto) {
    return  this.prisma.code.update({
      where: {
        id
      },
      data: updateCodeDto
    })
  }

  remove(id: number) {
    return  this.prisma.code.delete({
      where: {
        id
      }
    })
  }

  //validate code

  async validate(idCompte: number, code: string) {
    const codeValidation = await this.prisma.code.findFirst({
      where: {
        idCompte: +idCompte,
        code: +code

      }
    });

    if (!codeValidation) {
      throw new Error('Invalid code');
    }

    if (codeValidation.expireAt < new Date()) {
      throw new Error('Code expired');
    }
    //update code
     this.prisma.code.update({
      where: {
        id: codeValidation.id,
        code: +code

      },
      data: {
        estBloque: true
      }
    })

    //activer le compte
    return this.prisma.compte.update({
      where: {
        id: +idCompte
      },
      data: {
        statut: 'ACTIF',
        estVerifie: true
      }
    })

    
  }
   
}
