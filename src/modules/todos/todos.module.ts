import { Module } from '@nestjs/common';
import { TodosController } from './controllers/todos.controller';
import { TodosService } from './services/todos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from '../../database/mongoose/schemas/todo.schema';
import { TodoRepository } from './repositories/todo.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema,
      },
    ]),
  ],
  controllers: [TodosController],
  providers: [
    {
      provide: 'TodoRepositoryInterface',
      useClass: TodoRepository,
    },
    TodosService,
  ],
})
export class TodosModule {}
