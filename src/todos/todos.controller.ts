import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosService } from './todos.service';

@Controller('todo')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}
  @Get()
  getTodos() {
    return 'get todos hit';
  }
  @Post()
  createTodo(@Body() requestData: CreateTodoDto) {
    return this.todoService.store(requestData);
  }
}
