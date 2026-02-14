import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    async sendEmail(subject: string, html: string) {
        const to = this.configService.get<string>('TO_EMAIL_LIST');
        const from = this.configService.get<string>('EMAIL_FROM');

        if (!to) {
            this.logger.warn('TO_EMAIL_LIST is not defined. Skipping email sending.');
            return;
        }

        try {
            const info = await this.transporter.sendMail({
                from: from || '"Website Monitor" <noreply@example.com>',
                to: to.split(','), // Support multiple recipients
                subject,
                html,
            });

            this.logger.log(`Email sent: ${info.messageId}`);
        } catch (error) {
            this.logger.error('Error sending email:', error);
        }
    }
}
