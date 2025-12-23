import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailQueue, MailQueueDocument } from './mail-queue.schema';
import { welcomeTemplate } from '../../templates/welcome.template';
import { resetPasswordTemplate } from '../../templates/reset-password.template';
import { productCreatedTemplate } from '../../templates/product-created.template';
import { MESSAGES } from '../../constants/messages.constant';
import { MailProcessor } from './mail.processor';

@Controller('mail')
export class MailController {
  constructor(
    @InjectModel(MailQueue.name)
    private readonly mailQueueModel: Model<MailQueueDocument>,
    private readonly mailProcessor: MailProcessor,
  ) {}

  /* ================= NORMAL MAIL ================= */

  @Post('send')
  async sendNormalMail(@Body() body: any) {
    if (!body.to || !body.subject || !body.text) {
      throw new BadRequestException(
        'to, subject and text are required',
      );
    }

    const queuedMail = await this.mailQueueModel.create({
      to: body.to,
      subject: body.subject,
      text: body.text,
    });

    // console.log('Normal mail queued', {
    //   queueId: queuedMail._id.toString(),
    //   to: queuedMail.to,
    //   subject: queuedMail.subject,
    //   status: queuedMail.status, //
    //   retryCount: queuedMail.retryCount,
    // });

    return { message: MESSAGES.MAIL_SEND };
  }

  /* ================= PROCESS QUEUE ================= */

  @Post('process-queue')
  async processQueueManually() {
    // console.log('Manual mail queue trigger called');
    return this.mailProcessor.processQueue();
  }

  /* ================= TEMPLATE MAIL ================= */

  @Post('send-template')
  async sendTemplateMail(@Body() body: any) {
    const { to, type, attachments = [] } = body;

    if (!to || !type) {
      throw new BadRequestException('to and type are required');
    }

    let htmlContent = '';

    switch (type) {
      case 'WELCOME':
        if (!body.name) {
          throw new BadRequestException(
            'name is required for WELCOME',
          );
        }
        htmlContent = welcomeTemplate(body.name);
        break;

      case 'RESET_PASSWORD':
        if (!body.name || !body.otp) {
          throw new BadRequestException(
            'name and otp are required for RESET_PASSWORD',
          );
        }
        htmlContent = resetPasswordTemplate(body.name, body.otp);
        break;

      case 'PRODUCT_CREATED':
        if (!body.productName) {
          throw new BadRequestException(
            'productName is required for PRODUCT_CREATED',
          );
        }
        htmlContent = productCreatedTemplate(body.productName);
        break;

      default:
        throw new BadRequestException('Invalid mail type');
    }

    const queuedMail = await this.mailQueueModel.create({
      to,
      subject: body.subject || 'Notification',
      html: htmlContent,
      attachments,
    });

    console.log(' Template mail queued', {
      queueId: queuedMail._id.toString(),
      to: queuedMail.to,
      subject: queuedMail.subject,
      type,
      status: queuedMail.status, 
      attachmentsCount: queuedMail.attachments.length,
    });

    return { message: MESSAGES.MAIL_SEND };
  }
}
