// src/sms/sms.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/create-sm.dto';


@Controller('sms')
export class SmsController {
    constructor(private readonly smsService: SmsService) {}

    @Post('send')
    async sendSms(@Body() smsData: SendSmsDto): Promise<Response> {
        return await this.smsService.sendSMS(smsData);
    }
}