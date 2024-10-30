import { PartialType } from '@nestjs/swagger';
import { CreateTransfertRecurentDto } from './create-transfert-recurent.dto';

export class UpdateTransfertRecurentDto extends PartialType(CreateTransfertRecurentDto) {}
