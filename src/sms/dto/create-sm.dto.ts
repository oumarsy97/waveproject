// src/sms/dto/sms.dto.ts
import { IsString, IsPhoneNumber, IsArray, IsNotEmpty, IsMobilePhone } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
export class SendSmsDto {
 

    @IsString()
    @IsNotEmpty()
    @IsMobilePhone()
    @ApiProperty()
    to: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    text: string;
}