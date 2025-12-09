import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    const now = new Date();
    console.log(
      `User Hit on base url at ${now.getDate()}-${now.getMonth()}-${now.getFullYear()} - ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    );
    return 'Helo Todo App';
  }
}
