import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TransfertService } from './transfert.service';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { UpdateTransfertDto } from './dto/update-transfert.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('transfert')
@ApiTags('Transfert')
export class TransfertController {
  constructor(private readonly transfertService: TransfertService) {}

 
  @Post('/schedule')
  scheduleTransfert(@Body() createTransfertDto: CreateTransfertDto) {
    return this.transfertService.scheduleTransfert(createTransfertDto);
  }

  @Post()
  create(@Body() createTransfertDto: CreateTransfertDto) {
    return this.transfertService.create(createTransfertDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Req() req: Request & { user: number }) {
    const user = req.user;
    const transferts = this.transfertService.findbyCompte(+user);
    return transferts
  }

  @Get()
  findAll() {
    return this.transfertService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transfertService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransfertDto: UpdateTransfertDto) {
    return this.transfertService.update(+id, updateTransfertDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transfertService.remove(+id);
  }
}
