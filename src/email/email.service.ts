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
      from: `"Your App" <${this.config.get('SMTP_USER')}>`,
      to: email,
      subject: 'Your Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Use this code to log in:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold;">
            ${code}
          </div>
          <p style="color: #666;">This code expires in 5 minutes.</p>
        </div>
      `,
    });
  }
}