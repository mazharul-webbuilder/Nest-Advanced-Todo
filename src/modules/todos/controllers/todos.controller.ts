import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { TodosService } from '../services/todos.service';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { TodoPresenter } from '../presenters/todo.presenter';
import { TodoDocument } from '../../../database/mongoose/schemas/todo.schema';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  /***
   Create new todo
   */
  @Get()
  async getTodos(@Query() paginationQueryDto: PaginationQueryDto) {
    return await this.todoService.getTodos(paginationQueryDto);
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
    const todo: TodoDocument = await this.todoService.details(todoId);
    return new TodoPresenter(todo).toJSON();
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
   Mark as completed
   */
  @Patch('mark-as-completed/:id')
  async markCompleted(@Param('id') taskId: string) {
    return await this.todoService.markAsCompleted(taskId);
  }

  /***
   Get todo details
   */
  @Delete(':id')
  async delete(@Param('id') todoId: string) {
    return await this.todoService.delete(todoId);
  }
}
