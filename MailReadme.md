```js
// 1. Install dependencies:
// npm install @nestjs-modules/mailer nodemailer
// npm install -D @types/nodemailer

// =====================================================
// mail.module.ts
// =====================================================
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: config.get('MAIL_SECURE') === 'true', // true for 465, false for other ports
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${config.get('MAIL_FROM_NAME')}" <${config.get('MAIL_FROM_ADDRESS')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
}

// =====================================================
// mail.service.ts
// =====================================================
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export
interface
SendMailOptions
{
  to: string | string[];
  subject: string;
  template ? : string;
  context ? : Record < string, any >;
  html ? : string;
  text ? : string;
  attachments ? : Array < {
    filename: string;
    path? : string;
    content? : Buffer | string;
  } >;
}

@Injectable()
export class MailService {
  constructor(
    private

  mailerService: MailerService
,
  private configService: ConfigService
,
) {
}

async
sendMail(options
:
SendMailOptions
):
Promise < void > {
  try {
    await this.mailerService.sendMail({
      to: options.to,
      subject: options.subject,
      template: options.template,
      context: options.context,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    });
  } catch(error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

async
sendWelcomeEmail(email
:
string, name
:
string
):
Promise < void > {
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

async
sendPasswordResetEmail(
  email
:
string,
  name
:
string,
  resetToken
:
string,
):
Promise < void > {
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

async
sendVerificationEmail(
  email
:
string,
  name
:
string,
  verificationToken
:
string,
):
Promise < void > {
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

async
sendCustomEmail(
  to
:
string | string[],
  subject
:
string,
  htmlContent
:
string,
):
Promise < void > {
  await this.sendMail({
    to,
    subject,
    html: htmlContent,
  });
}

async
sendBulkEmails(emails
:
SendMailOptions[]
):
Promise < void > {
  const promises = emails.map((email) => this.sendMail(email));
  await Promise.allSettled(promises);
}
}

// =====================================================
// .env configuration
// =====================================================
// MAIL_HOST=smtp.gmail.com
// MAIL_PORT=587
// MAIL_SECURE=false
// MAIL_USER=your-email@gmail.com
// MAIL_PASSWORD=your-app-password
// MAIL_FROM_NAME=Your App Name
// MAIL_FROM_ADDRESS=noreply@yourapp.com
// APP_URL=http://localhost:3000

// =====================================================
// app.module.ts - Import MailModule
// =====================================================
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
  ],
})
export class AppModule {
}

// =====================================================
// Example Usage in a Controller or Service
// =====================================================
import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail/mail.service';

@Controller('mail')
export class MailController {
  constructor(private

  readonly
  mailService: MailService
) {
}

@Post('welcome')
async
sendWelcome(@Body()
body: {
  email: string;
  name: string
}
)
{
  await this.mailService.sendWelcomeEmail(body.email, body.name);
  return { message: 'Welcome email sent successfully' };
}

@Post('custom')
async
sendCustom(
  @Body()
body: {
  to: string;
  subject: string;
  html: string
}
,
)
{
  await this.mailService.sendCustomEmail(body.to, body.subject, body.html);
  return { message: 'Email sent successfully' };
}
}

// =====================================================
// Email Templates (Handlebars)
// =====================================================

// templates/welcome.hbs
/*
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { display: inline-block; padding: 10px 20px; background: #4CAF50; 
              color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Our Platform!</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}},</h2>
      <p>Thank you for joining us! We're excited to have you on board.</p>
      <p>Get started by exploring our platform:</p>
      <a href="{{appUrl}}" class="button">Get Started</a>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The Team</p>
    </div>
  </div>
</body>
</html>
*/

// templates/password-reset.hbs
/*
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 10px 20px; background: #2196F3; 
              color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hello {{name}},</p>
    <p>You requested to reset your password. Click the button below to proceed:</p>
    <a href="{{resetUrl}}" class="button">Reset Password</a>
    <p>This link will expire in {{expiryTime}}.</p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
</body>
</html>
*/
```