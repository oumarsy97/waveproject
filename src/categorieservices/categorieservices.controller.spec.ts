import { Test, TestingModule } from '@nestjs/testing';
import { CategorieservicesController } from './categorieservices.controller';
import { CategorieservicesService } from './categorieservices.service';

describe('CategorieservicesController', () => {
  let controller: CategorieservicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategorieservicesController],
      providers: [CategorieservicesService],
    }).compile();

    controller = module.get<CategorieservicesController>(CategorieservicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
