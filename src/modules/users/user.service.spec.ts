import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { MESSAGES } from '../../constants/messages.constant';

/* Properly typed mock constructor */
type MockUserModel = jest.Mock & {
  findOne: jest.Mock;
  find: jest.Mock;
  findOneAndUpdate: jest.Mock;
};

describe('UserService', () => {
  let service: UserService;
  let mockUserModel: MockUserModel;

  beforeEach(async () => {
    mockUserModel = jest.fn() as unknown as MockUserModel;

    mockUserModel.findOne = jest.fn();
    mockUserModel.find = jest.fn();
    mockUserModel.findOneAndUpdate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  /* ===================== BASIC ===================== */

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* ===================== FIND BY EMAIL ===================== */

  it('should find user by email', async () => {
    const user = { email: 'test@test.com' };

    mockUserModel.findOne.mockResolvedValue(user);

    const result = await service.findByEmail('test@test.com');

    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: 'test@test.com',
      isDeleted: { $ne: true },
    });

    expect(result).toEqual(user);
  });

  /* ===================== FIND ALL ===================== */

  it('should return all active users without password', async () => {
    const users = [{ email: 'a@test.com' }];

    mockUserModel.find.mockReturnValue({
      select: jest.fn().mockResolvedValue(users),
    });

    const result = await service.findAll();

    expect(result).toEqual(users);
  });

  /* ===================== FIND BY ID ===================== */

  it('should return user by id', async () => {
    const user = { _id: '1', email: 'test@test.com' };

    mockUserModel.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    });

    const result = await service.findById('1');

    expect(result).toEqual(user);
  });

  it('should throw NotFoundException if user not found', async () => {
    mockUserModel.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findById('999')).rejects.toThrow(
      NotFoundException,
    );
  });

  /* ===================== CREATE ===================== */

  // it('should create a user', async () => {
  //   const dto = { email: 'new@test.com', password: '123456' };

  //   const saveMock = jest.fn().mockResolvedValue(dto);

  //   mockUserModel.mockImplementation(() => ({
  //     save: saveMock,
  //   }));

  //   const result = await service.create(dto);

  //   expect(saveMock).toHaveBeenCalled();
  //   expect(result).toEqual(dto);
  // });

  /* ===================== UPDATE ===================== */

  it('should update user', async () => {
    mockUserModel.findOneAndUpdate.mockResolvedValue({ _id: '1' });

    const result = await service.update('1', { name: 'Updated' });

    expect(result).toEqual({
      message: MESSAGES.USER_UPDATED,
    });
  });

  it('should throw NotFoundException if update user not found', async () => {
    mockUserModel.findOneAndUpdate.mockResolvedValue(null);

    await expect(
      service.update('999', {}),
    ).rejects.toThrow(NotFoundException);
  });

  /* ===================== REMOVE ===================== */

  it('should soft delete user', async () => {
    mockUserModel.findOneAndUpdate.mockResolvedValue({ _id: '1' });

    const result = await service.remove('1');

    expect(result).toEqual({
      message: MESSAGES.USER_DELETED,
    });
  });

  it('should throw NotFoundException if delete user not found', async () => {
    mockUserModel.findOneAndUpdate.mockResolvedValue(null);

    await expect(service.remove('999')).rejects.toThrow(
      NotFoundException,
    );
  });
});
