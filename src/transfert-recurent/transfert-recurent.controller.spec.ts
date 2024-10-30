import { Test, TestingModule } from '@nestjs/testing';
import { TransfertRecurentController } from './transfert-recurent.controller';
import { TransfertRecurentService } from './transfert-recurent.service';

describe('TransfertRecurentController', () => {
  let controller: TransfertRecurentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransfertRecurentController],
      providers: [TransfertRecurentService],
    }).compile();

    controller = module.get<TransfertRecurentController>(TransfertRecurentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
