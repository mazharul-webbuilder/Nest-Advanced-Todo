import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { TodosService } from '../services/todos.service';
import { UpdateTodoDto } from '../dtos/update-todo.dto';

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

  /***
   Get todo details
   */
  @Put(':id')
  async updateTodo(
    @Param('id') todoId: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return await this.todoService.update(todoId, updateTodoDto);
  }

  /***
   Get todo details
   */
  @Delete(':id')
  async delete(@Param('id') todoId: string) {
    return await this.todoService.delete(todoId);
  }
}
