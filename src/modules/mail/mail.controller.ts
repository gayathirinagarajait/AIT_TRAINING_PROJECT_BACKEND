import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { sendMail } from '../utils/mail.util';
import { welcomeTemplate } from '../../templates/welcome.template';
import { resetPasswordTemplate } from '../../templates/reset-password.template';
import { productCreatedTemplate } from '../../templates/product-created.template';
import { MESSAGES } from '../../constants/messages.constant';

@Controller('mail')
export class MailController {

  // NORMAL MAIL (NO TEMPLATE)
  @Post('send')
  async sendNormalMail(@Body() body: any) {
    try {
      if (!body.to || !body.subject || !body.text) {
        throw new BadRequestException(
          'to, subject and text are required',
        );
      }

      await sendMail({
        to: body.to,
        subject: body.subject,
        text: body.text,
      });

      return { message: 'Normal mail sent successfully' };
    } catch (error) {
      throw error;
    }
  }

  // TEMPLATE MAIL
  @Post('send-template')
  async sendTemplateMail(@Body() body: any) {
    try {
      if (!body.to || !body.type) {
        throw new BadRequestException('to and type are required');
      }

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

      await sendMail({
        to: body.to,
        subject: body.subject || 'Notification',
        html: htmlContent,
      });

      return { message:MESSAGES.MAIL_SEND };
    } catch (error) {
      throw error;
    }
  }
}
