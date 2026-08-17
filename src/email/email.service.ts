import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendOtp(email: string, code: string): Promise<void> {
   await this.transporter.sendMail({
  from: `"ZMB Dairay & Cattel Farm (PVT) LTD" <${this.config.get('SMTP_USER')}>`,
  to: email,
  subject: '🔐 Your Verification Code - ZMB(PVT)LTD',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" style="max-width: 500px; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a472a 0%, #2d6a4f 100%); padding: 32px 30px 28px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                    🏠 ZMB(PVT)LTD
                  </h1>
                  <p style="margin: 6px 0 0; color: #a8d5ba; font-size: 14px; font-weight: 300;">
                    Dairay & Cattel Farm
                  </p>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 30px 30px;">
                  <h2 style="margin: 0 0 8px; color: #1a1a1a; font-size: 22px; font-weight: 600;">
                    Verification Code
                  </h2>
                  <p style="margin: 0 0 24px; color: #5a6a7a; font-size: 15px; line-height: 1.6;">
                    Enter the code below to access your account. This code is valid for 
                    <strong style="color: #1a472a;">5 minutes</strong>.
                  </p>
                  
                  <!-- Code Box -->
                  <div style="background: #f8fafc; border: 2px dashed #d0d9e3; border-radius: 12px; padding: 24px 20px; text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 40px; letter-spacing: 12px; font-weight: 700; color: #1a472a; font-family: 'Courier New', monospace;">
                      ${code}
                    </div>
                  </div>
                  
                  <!-- Security Notice -->
                  <div style="background: #fef9e7; border-left: 4px solid #f5b342; padding: 14px 18px; border-radius: 6px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 13px; color: #7a6b3a;">
                      🔒 <strong>Security Tip:</strong> Never share this code with anyone. 
                      ZMB(PVT)LTD will never ask for this code outside of the login page.
                    </p>
                  </div>
                  
                  <hr style="border: none; border-top: 1px solid #e8edf2; margin: 24px 0 20px;">
                  
                  <p style="margin: 0; color: #8a9aa8; font-size: 13px; line-height: 1.5; text-align: center;">
                    Didn't request this code? 
                    <a href="#" style="color: #1a472a; text-decoration: none; font-weight: 500;">
                      Contact support
                    </a>
                    <br>
                    <span style="font-size: 12px; color: #aab8c5;">
                      ZMB Dairay & Cattel Farm (PVT) LTD
                    </span>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e8edf2;">
                  <p style="margin: 0; font-size: 12px; color: #8a9aa8;">
                    &copy; ${new Date().getFullYear()} ZMB(PVT)LTD. All rights reserved.
                  </p>
                  <p style="margin: 4px 0 0; font-size: 12px; color: #aab8c5;">
                    This is an automated message, please do not reply.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
});
  }
}