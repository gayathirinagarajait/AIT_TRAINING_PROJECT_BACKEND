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

@Controller('mail')
export class MailController {
  constructor(
    @InjectModel(MailQueue.name)
    private mailQueueModel: Model<MailQueueDocument>,
  ) {}

  @Post('send')
  async sendNormalMail(@Body() body: any) {
    if (!body.to || !body.subject || !body.text) {
      throw new BadRequestException(
        'to, subject and text are required',
      );
    }

    await this.mailQueueModel.create({
      to: body.to,
      subject: body.subject,
      text: body.text,
    });

    return { message: MESSAGES.MAIL_SEND };
  }

  @Post('send-template')
  async sendTemplateMail(@Body() body: any) {
    if (!body.to || !body.type) {
      throw new BadRequestException('to and type are required');
    }
//defined templates 
    let htmlContent = '';

    switch (body.type) {
      case 'WELCOME':
        htmlContent = welcomeTemplate(body.name);
        break;
      case 'RESET_PASSWORD':
        htmlContent = resetPasswordTemplate(body.name, body.otp);
        break;
      case 'PRODUCT_CREATED':
        htmlContent = productCreatedTemplate(body.productName);
        break;
      default:
        throw new BadRequestException('Invalid mail type');
    }

    await this.mailQueueModel.create({
      to: body.to,
      subject: body.subject || 'Notification',
      html: htmlContent,
      attachments: body.attachments || [],
    });
    return { message: MESSAGES.MAIL_SEND };
  }
}
