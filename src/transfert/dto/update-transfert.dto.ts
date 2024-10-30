import { PartialType } from '@nestjs/swagger';
import { CreateTransfertDto } from './create-transfert.dto';

export class UpdateTransfertDto extends PartialType(CreateTransfertDto) {}
