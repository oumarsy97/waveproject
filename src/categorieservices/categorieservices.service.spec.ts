import { Test, TestingModule } from '@nestjs/testing';
import { CategorieservicesService } from './categorieservices.service';

describe('CategorieservicesService', () => {
  let service: CategorieservicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategorieservicesService],
    }).compile();

    service = module.get<CategorieservicesService>(CategorieservicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
