// src/sms/sms.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/create-sm.dto';
import { ApiTags } from '@nestjs/swagger';


@Controller('sms')
@ApiTags('sms')
export class SmsController {
    constructor(private readonly smsService: SmsService) {}

    @Post('send')
    async sendSms(@Body() smsData: SendSmsDto): Promise<Response> {
        return await this.smsService.sendSMS(smsData);
    }
}