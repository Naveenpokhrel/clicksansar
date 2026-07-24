const { Resend } = require('resend');

const sendLeadNotification = async (leadData) => {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 'mock_resend_key' || resendApiKey.startsWith('mock')) {
      console.log('Skipping email notification: mock or empty Resend API key configured.');
      return;
    }

    const resend = new Resend(resendApiKey);

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const toEmail = process.env.TO_EMAIL || 'naveenpokhrel.skillprompt@gmail.com';

    const response = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Lead Inquiry: ${leadData.fullName} - ${leadData.serviceInterested}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1d4ed8;">New Business Inquiry Received</h2>
          <p>A user has submitted the lead form on the Click Sansar website.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 35%;">Full Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${leadData.email}">${leadData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Phone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Company:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.companyName || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Business Type:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.businessType || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Service:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.serviceInterested}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Budget:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.budget || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Message:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.message || 'N/A'}</td>
            </tr>
          </table>
        </div>
      `,
    });

    if (response.error) {
      console.error('Resend API Error details:', response.error);
    } else {
      console.log('Lead notification email sent successfully via Resend. ID:', response.data?.id);
    }
  } catch (error) {
    console.error('Resend Error: Unable to send lead notification email -', error.message);
  }
};

module.exports = { sendLeadNotification };

