import { IsEmail } from 'class-validator';

export class SendOtpDto {
  @IsEmail({}, { message: 'address not found' })
  email: string;
}