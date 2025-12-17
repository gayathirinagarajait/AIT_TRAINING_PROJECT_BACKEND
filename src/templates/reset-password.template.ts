export const resetPasswordTemplate = (name: string, otp: number) => {
  const brandBlue = '#0070f3';
  const darkBlue = '#003366';
  const lightGray = '#f4f7f9';

  return `
    <div style="background-color: ${lightGray}; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif; color: #333;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-top: 6px solid ${brandBlue};">
        <div style="padding: 30px 40px; text-align: center;">
          <h2 style="color: ${darkBlue}; margin-bottom: 10px;">Password Reset</h2>
          <p style="color: #666; font-size: 16px;">Hello ${name},</p>
          <p style="color: #666; font-size: 15px;">Use the verification code below to reset your password:</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f0f7ff; border: 1px dashed ${brandBlue}; border-radius: 10px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: ${brandBlue};">
              ${otp}
            </span>
          </div>
          
          <p style="font-size: 13px; color: #999;">
            This OTP is valid for <b>10 minutes</b>. If you did not request this, please ignore this email.
          </p>
          
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px;">
            <p style="margin: 0; font-weight: bold; color: ${darkBlue};">Team NestJS</p>
          </div>
        </div>
      </div>
    </div>
  `;
};