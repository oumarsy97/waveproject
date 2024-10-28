// src/sms/dto/sms.dto.ts
import { IsString, IsPhoneNumber, IsArray, IsNotEmpty, IsMobilePhone } from 'class-validator';

export class SendSmsDto {
 

    @IsString()
    @IsNotEmpty()
    @IsMobilePhone()
    to: string;

    @IsString()
    @IsNotEmpty()
    text: string;
}