import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { OtpService } from '../otp/otp.service';
import { EmailService } from '../email/email.service';
import { validate } from 'deep-email-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private otpService: OtpService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(email: string) {
    const canSend = await this.otpService.canResendOtp(email);
    if (!canSend) {
      throw new BadRequestException('Please wait 60 seconds before requesting a new OTP');
    }

    const emailCheck = await validate(email);
    if (!emailCheck.valid) {
      throw new BadRequestException('address not found');
    }

    const code = await this.otpService.generateOtp(email);
    
    try {
      await this.emailService.sendOtp(email, code);
    } catch (error) {
      throw new BadRequestException('address not found');
    }

    return {
      message: 'OTP sent to your email',
      devCode: process.env.NODE_ENV === 'development' ? code : undefined,
    };
  }

  async verifyOtp(email: string, code: string) {
    await this.otpService.verifyOtp(email, code);

    let user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      user = this.userRepo.create({ email, isVerified: true });
      await this.userRepo.save(user);
    } else if (!user.isVerified) {
      user.isVerified = true;
      await this.userRepo.save(user);
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async getProfile(userId: string) {
    return this.userRepo.findOne({
      where: { id: userId },
      select: {id:true,email:true,name:true,createdAt:true},
    });
  }
}