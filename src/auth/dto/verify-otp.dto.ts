import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail({}, { message: 'address not found' })
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;
}