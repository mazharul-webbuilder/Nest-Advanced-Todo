import { Module } from '@nestjs/common';
import { TodosController } from './controllers/todos.controller';
import { TodosService } from './services/todos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from '../../database/mongoose/schemas/todo.schema';
import { User, UserSchema } from '../../database/mongoose/schemas/user.schema';
import { TodoRepository } from './repositories/todo.repository';
import { TodoReminderService } from './services/todo-reminder.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MailModule,
  ],
  controllers: [TodosController],
  providers: [
    {
      provide: 'TodoRepositoryInterface',
      useClass: TodoRepository,
    },
    TodosService,
    TodoReminderService,
  ],
})
export class TodosModule {}
