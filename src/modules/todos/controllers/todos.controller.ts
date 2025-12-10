import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { TodosService } from '../services/todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  /***
   Create new todo
   */
  @Get()
  async getTodos() {
    return await this.todoService.getTodos();
  }

  /***
   Create new todo
   */
  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto) {
    return await this.todoService.store(createTodoDto);
  }

  /***
   Get todo details
   */
  @Get(':id')
  async getDetails(@Param('id') todoId: string) {
    return await this.todoService.details(todoId);
  }
}
