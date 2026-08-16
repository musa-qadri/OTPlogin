import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';

@Injectable()
export class OtpService {
  private readonly OTP_EXPIRY_MINUTES = 5;

  constructor(
    @InjectRepository(Otp)
    private otpRepo: Repository<Otp>,
  ) {}

  async generateOtp(email: string): Promise<string> {
    await this.otpRepo.update(
      { email, isUsed: false },
      { isUsed: true },
    );

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const otp = this.otpRepo.create({
      email,
      code,
      expiresAt: new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000),
    });

    await this.otpRepo.save(otp);
    return code;
  }

  async verifyOtp(email: string, code: string): Promise<void> {
    const otp = await this.otpRepo.findOne({
      where: { email, code, isUsed: false },
      order: { createdAt: 'DESC' },
    });

    if (!otp) throw new BadRequestException('Invalid OTP');
    if (new Date() > otp.expiresAt) throw new BadRequestException('OTP expired');

    otp.isUsed = true;
    await this.otpRepo.save(otp);
  }

  async canResendOtp(email: string): Promise<boolean> {
    const latest = await this.otpRepo.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });

    if (!latest) return true;
    return new Date() > new Date(latest.createdAt.getTime() + 60 * 1000);
  }
}