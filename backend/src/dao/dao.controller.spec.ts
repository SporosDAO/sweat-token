import { Test, TestingModule } from '@nestjs/testing';
import { DaoController } from './dao.controller';

describe('DaoController', () => {
  let controller: DaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DaoController],
    }).compile();

    controller = module.get<DaoController>(DaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
