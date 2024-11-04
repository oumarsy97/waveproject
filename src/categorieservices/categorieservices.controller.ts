import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategorieservicesService } from './categorieservices.service';
import { CreateCategorieserviceDto } from './dto/create-categorieservice.dto';
import { UpdateCategorieserviceDto } from './dto/update-categorieservice.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('categorieservices')
@ApiTags('categorieservices')
export class CategorieservicesController {
  constructor(private readonly categorieservicesService: CategorieservicesService) {}

  @Post()
  create(@Body() createCategorieserviceDto: CreateCategorieserviceDto) {
    return this.categorieservicesService.create(createCategorieserviceDto);
  }

  @Get()
  findAll() {
    return this.categorieservicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categorieservicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategorieserviceDto: UpdateCategorieserviceDto) {
    return this.categorieservicesService.update(+id, updateCategorieserviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categorieservicesService.remove(+id);
  }
}
