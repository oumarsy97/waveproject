import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { ComptesService } from './comptes.service';
import { CreateCompteDto } from './dto/create-compte.dto';
import { UpdateCompteDto } from './dto/update-compte.dto';

@Controller('comptes')
export class ComptesController {
  constructor(private readonly comptesService: ComptesService) {}

  @Post()
  create(@Body() createCompteDto: CreateCompteDto) {
    return this.comptesService.create(createCompteDto);
  }
  @Post('token')
  async findOneByToken(@Body() body: { token: string }) {
    const { token } = body;

    if (!token) {
      throw new UnauthorizedException('Token requis');
    }

    return this.comptesService.findOneByToken(token);
  }

  @Get()
  findAll() {
    return this.comptesService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comptesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompteDto: UpdateCompteDto) {
    return this.comptesService.update(+id, updateCompteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comptesService.remove(+id);
  }

  
}
