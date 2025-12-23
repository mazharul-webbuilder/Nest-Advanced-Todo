import { Controller, Get } from '@nestjs/common';
import { MailService } from './modules/mail/services/mail/mail.service';
import { SendMailOptions } from './modules/mail/interface/mail-send-options.interface';

@Controller()
export class AppController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async getHello(): Promise<string> {
    const emailMeta: SendMailOptions = {
      to: 'mazharul.jatri@gmail.com',
      subject: 'Welcome to the todo',
      // Option 1: Use HTML content
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>Welcome to Todo App!</h1>
          <p>Thank you for using our application.</p>
          <p>Get started by creating your first task!</p>
        </div>
      `,
      // Option 2: Use plain text (or use both)
      text: 'Welcome to Todo App! Thank you for using our application.',
    };

    await this.mailService.sendMail(emailMeta);

    const now = new Date();
    console.log(
      `User Hit on base url at ${now.getDate()}-${now.getMonth()}-${now.getFullYear()} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    );
    return 'Hello Todo App - Email Sent!';
  }
}
