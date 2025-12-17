import * as nodemailer from 'nodemailer';

export const sendMail = async (options: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Nest App" <${process.env.MAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
      // attachments: options.attachments || [],
    });
  } catch (error) {
    throw error;
  }
};
