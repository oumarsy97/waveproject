import { PartialType } from '@nestjs/swagger';
import { CreateCategorieserviceDto } from './create-categorieservice.dto';

export class UpdateCategorieserviceDto extends PartialType(CreateCategorieserviceDto) {}
