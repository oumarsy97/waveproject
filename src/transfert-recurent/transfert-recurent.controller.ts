import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req, Patch } from '@nestjs/common';
import { TransfertRecurrentService, CreateRecurringTransferDto } from './transfert-recurent.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('transfert-recurrent')
@ApiTags('Transfert Récurrent')

export class TransfertRecurrentController {
  constructor(private readonly service: TransfertRecurrentService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un transfert récurrent' })
  create(@Body() dto: CreateRecurringTransferDto) {
    return this.service.createRecurringTransfer(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtenir mes transferts récurrents' })
  findAll(@Req() req: Request & { user: number }) {
    return this.service.findAllRecurringTransfers(req.user);
  }

  @Patch(':id/suspend')
  @ApiOperation({ summary: 'Suspendre un transfert récurrent' })
  suspend(@Param('id') id: string) {
    return this.service.suspendRecurringTransfer(+id, 'Suspendu par l\'utilisateur');
  }

  @Patch(':id/resume')
  @ApiOperation({ summary: 'Reprendre un transfert récurrent' })
  resume(@Param('id') id: string) {
    return this.service.resumeRecurringTransfer(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler un transfert récurrent' })
  cancel(@Param('id') id: string) {
    return this.service.cancelRecurringTransfer(+id);
  }
}