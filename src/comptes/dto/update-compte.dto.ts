import { PartialType } from '@nestjs/swagger';
import { CreateCompteDto } from './create-compte.dto';

export class UpdateCompteDto extends PartialType(CreateCompteDto) {}
