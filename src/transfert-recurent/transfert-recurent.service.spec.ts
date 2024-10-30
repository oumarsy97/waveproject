import { Test, TestingModule } from '@nestjs/testing';
import { TransfertRecurrentService } from './transfert-recurent.service';

describe('TransfertRecurentService', () => {
  let service: TransfertRecurrentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransfertRecurrentService],
    }).compile();

    service = module.get<TransfertRecurrentService>(TransfertRecurrentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
