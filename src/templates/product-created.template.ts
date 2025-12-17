export const productCreatedTemplate = (productName: string) => {
  const brandBlue = '#0070f3';
  const successGreen = '#28a745';
  const darkBlue = '#003366';

  return `
    <div style="background-color: #f4f7f9; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-top: 6px solid ${brandBlue};">
        
        <div style="padding: 30px 40px;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <h2 style="color: ${darkBlue}; margin: 0; font-size: 22px;">Product Created Successfully</h2>
            <span style="margin-left: 10px; color: ${successGreen}; font-size: 22px;">✓</span>
          </div>
          
          <p style="font-size: 16px; color: #555; line-height: 1.5;">
            Great news! The product <strong style="color: ${brandBlue};">"${productName}"</strong> has been successfully added to your inventory.
          </p>

          <div style="margin: 25px 0; padding: 15px; background-color: #fafafa; border: 1px solid #eee; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <b>Inventory Status:</b> Active <br/>
              <b>Timestamp:</b> ${new Date().toLocaleString()}
            </p>
          </div>

          <p style="font-size: 15px; color: #555;">
            You can now view or edit this product from your administration dashboard.
          </p>

          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            <p style="margin: 0; font-weight: bold; color: ${darkBlue};">Team NestJS</p>
            <p style="margin: 0; font-size: 13px; color: ${brandBlue};">Inventory Management Systems</p>
          </div>
        </div>
      </div>
    </div>
  `;
};