export const welcomeTemplate = (name: string) => {
  const brandBlue = '#0070f3'; 
  const darkBlue = '#003366';  
  const lightGray = '#f4f7f9';

  return `
    <div style="background-color: ${lightGray}; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-top: 6px solid ${brandBlue};">
        
        <div style="padding: 30px 40px;">
          <h2 style="color: ${darkBlue}; margin-top: 0; font-size: 24px; font-weight: 700;">
            Welcome, ${name}
          </h2>
          
          <p style="font-size: 16px; color: #555;">
            Thank you for joining our platform. We’re excited to have you as part of our community.
          </p>

          <div style="margin: 30px 0; padding: 20px; background-color: #eef6ff; border-left: 4px solid ${brandBlue}; border-radius: 4px;">
            <p style="margin: 0; font-style: italic; color: ${darkBlue};">
              "We are dedicated to providing you with the best experience possible."
            </p>
          </div>

          <p style="font-size: 16px; color: #555;">
            You can now access your dashboard and begin exploring all the tools available to you.
          </p>
          
          <br/>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px;">
            <p style="margin: 0; font-weight: bold; color: ${darkBlue};">Best Regards,</p>
            <p style="margin: 0; color: ${brandBlue}; font-weight: 600;">Team AIT</p>
          </div>
        </div>

        <div style="background-color: #fafafa; padding: 15px 40px; text-align: center; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} NestJS Application. All rights reserved.
        </div>
      </div>
    </div>
  `;
};