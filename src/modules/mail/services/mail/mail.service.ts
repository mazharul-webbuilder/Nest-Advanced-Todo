import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { SendMailOptions } from '../../interface/mail-send-options.interface';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendMail(options: SendMailOptions): Promise<void> {
    if (!options.template && !options.html && !options.text) {
      throw new Error(
        'Email must have at least one of: template, html, or text',
      );
    }

    await this.mailerService.sendMail({
      to: options.to,
      subject: options.subject,
      template: options.template,
      context: options.context,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    });
  }

  async sendBulkEmails(emails: SendMailOptions[]): Promise<void> {
    const promises = emails.map((email) => this.sendMail(email));
    await Promise.allSettled(promises);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Welcome to Our Platform!',
      template: './welcome',
      context: {
        name,
        appUrl: this.configService.get('APP_URL'),
      },
    });
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
  ): Promise<void> {
    const resetUrl = `${this.configService.get('APP_URL')}/reset-password?token=${resetToken}`;

    await this.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        name,
        resetUrl,
        expiryTime: '1 hour',
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string,
  ): Promise<void> {
    const verificationUrl = `${this.configService.get('APP_URL')}/verify-email?token=${verificationToken}`;

    await this.sendMail({
      to: email,
      subject: 'Verify Your Email Address',
      template: './email-verification',
      context: {
        name,
        verificationUrl,
      },
    });
  }

  async sendCustomEmail(
    to: string | string[],
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    await this.sendMail({
      to,
      subject,
      html: htmlContent,
    });
  }
}
