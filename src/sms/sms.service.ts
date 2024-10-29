
// src/sms/sms.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendSmsDto } from './dto/create-sm.dto';
import { title } from 'process';
import { channel } from 'diagnostics_channel';

@Injectable()
export class SmsService {

    private getHeaders(): Headers {
        const headers = new Headers();
        headers.append('Authorization', `App 4e26a39b6ce978b730248e39f736344b-3586b3b0-4141-4f7c-8653-6827e639f216`);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        return headers;
    }

    private prepareMessageBody(data: SendSmsDto): string {
        return JSON.stringify({
            messages: [
                {
                    destinations: [{ to:'221'+data.to }],
                    from: 'WAVE',
                    text: data.text,
                },
            ],
        });
    }

    async sendSMS(smsData: SendSmsDto): Promise<Response> {
        try {
            const response = await fetch(
                `https://w1qlj8.api.infobip.com/sms/2/text/advanced`,
                {
                    method: 'POST',
                    headers: this.getHeaders(),
                    body: this.prepareMessageBody(smsData),
                }
            );

            if (!response.ok) {
                throw new HttpException(
                    'Erreur lors de l\'envoi du SMS',
                    HttpStatus.BAD_REQUEST
                );
            }

            const result = await response.json();
            return result.messages[0];
        } catch (error) {
            throw new HttpException(
                error.message || 'Erreur service SMS',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}