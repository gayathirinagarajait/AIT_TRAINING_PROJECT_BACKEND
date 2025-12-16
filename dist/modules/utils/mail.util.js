"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = require("nodemailer");
const sendMail = async (options) => {
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
            text: options.text,
            html: options.html,
            attachments: options.attachments || [],
        });
        return true;
    }
    catch (error) {
        console.error('Mail Error:', error);
        throw error;
    }
};
exports.sendMail = sendMail;
//# sourceMappingURL=mail.util.js.map