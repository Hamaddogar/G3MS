import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseUserController } from './user.controller';

describe('FirebaseUserController', () => {
  let controller: FirebaseUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseUserController],
    }).compile();

    controller = module.get<FirebaseUserController>(FirebaseUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
