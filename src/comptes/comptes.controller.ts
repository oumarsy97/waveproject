import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { ComptesService } from './comptes.service';
import { CreateCompteDto } from './dto/create-compte.dto';
import { UpdateCompteDto } from './dto/update-compte.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Request } from 'express'; // Assurez-vous d'importer Request d'Express
import { ApiTags } from '@nestjs/swagger';


@Controller('comptes')
@ApiTags('comptes')
export class ComptesController {
  constructor(private readonly comptesService: ComptesService) {}
//getProfile
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile(@Req() req: Request) {
   const user = req.user;
   const compte = this.comptesService.findOne(+user);

  return compte
}

  @Get('others')
  @UseGuards(JwtAuthGuard)
  findbyCompte(@Req() req: Request) {
    const user = req.user;
   return this.comptesService.findbyCompte(+user);
    
  }

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
