import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { sendMail } from '../utils/mail.util';

@Controller('mail')
export class MailController {
  @Post('send')
  async sendEmail(@Body() body: any) {
    try {
      if (!body || !body.to) {
        throw new BadRequestException('Recipient email (to) is required');
      }

      await sendMail({
        to: body.to,
        subject: body.subject || 'No Subject',
        text: body.text || '',
        html: body.html || '',
        attachments: body.attachments || [],
      });

      return { message: 'Mail sent successfully' };
    } catch (error) {
      throw error;
    }
  }
}
