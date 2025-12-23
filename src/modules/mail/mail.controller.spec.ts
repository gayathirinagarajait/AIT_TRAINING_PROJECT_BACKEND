import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { MailController } from './mail.controller';
import { MailQueue } from './mail-queue.schema';
import { MESSAGES } from '../../constants/messages.constant';

/* Typed mongoose model mock */
type MockMailQueueModel = {
  create: jest.Mock;
};

describe('MailController', () => {
  let controller: MailController;
  let mockMailQueueModel: MockMailQueueModel;

  beforeEach(async () => {
    mockMailQueueModel = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: getModelToken(MailQueue.name),
          useValue: mockMailQueueModel,
        },
      ],
    }).compile();

    controller = module.get<MailController>(MailController);
    jest.clearAllMocks();
  });



  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /* ===================== SEND NORMAL MAIL ===================== */

  it('should send normal mail', async () => {
    mockMailQueueModel.create.mockResolvedValue({});

    const body = {
      to: 'gayugvns1704@gmail.com',
      subject: 'Hello',
      text: 'Test mail',
    };

    const result = await controller.sendNormalMail(body);

    expect(mockMailQueueModel.create).toHaveBeenCalledWith({
      to: body.to,
      subject: body.subject,
      text: body.text,
    });

    expect(result).toEqual({
      message: MESSAGES.MAIL_SEND,
    });
  });

  it('should throw error if required fields missing (normal mail)', async () => {
    await expect(
      controller.sendNormalMail({ to: 'test@test.com' }),
    ).rejects.toThrow(BadRequestException);
  });

  /* ===================== SEND TEMPLATE MAIL ===================== */

  it('should send WELCOME template mail', async () => {
    mockMailQueueModel.create.mockResolvedValue({});

    const body = {
      to: 'test@test.com',
      type: 'WELCOME',
      name: 'John',
    };

    const result = await controller.sendTemplateMail(body);

    expect(mockMailQueueModel.create).toHaveBeenCalledWith({
      to: body.to,
      subject: 'Notification',
      html: expect.any(String),
      attachments: [],
    });

    expect(result).toEqual({
      message: MESSAGES.MAIL_SEND,
    });
  });

  it('should send RESET_PASSWORD template mail', async () => {
    mockMailQueueModel.create.mockResolvedValue({});

    const body = {
      to: 'test@test.com',
      type: 'RESET_PASSWORD',
      name: 'John',
      otp: '123456',
    };

    const result = await controller.sendTemplateMail(body);

    expect(mockMailQueueModel.create).toHaveBeenCalled();
    expect(result.message).toBe(MESSAGES.MAIL_SEND);
  });

  it('should send PRODUCT_CREATED template mail', async () => {
    mockMailQueueModel.create.mockResolvedValue({});

    const body = {
      to: 'test@test.com',
      type: 'PRODUCT_CREATED',
      productName: 'iPhone',
    };

    const result = await controller.sendTemplateMail(body);

    expect(mockMailQueueModel.create).toHaveBeenCalled();
    expect(result.message).toBe(MESSAGES.MAIL_SEND);
  });

  it('should throw error if template type is invalid', async () => {
    await expect(
      controller.sendTemplateMail({
        to: 'test@test.com',
        type: 'INVALID_TYPE',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw error if required fields missing (template mail)', async () => {
    await expect(
      controller.sendTemplateMail({}),
    ).rejects.toThrow(BadRequestException);
  });
});
