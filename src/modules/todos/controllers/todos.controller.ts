import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import { TodosService } from '../services/todos.service';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { TodoPresenter } from '../presenters/todo.presenter';
import { TodoDocument } from '../../../database/mongoose/schemas/todo.schema';
import { TodoCollectionPresenter } from '../presenters/todo-collection.presenter';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  /***
   Create new todo
   */
  @Get()
  async getTodos(
    @Req() req: any,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<any> {
    const { items, total } = await this.todoService.getTodos(
      req.user.userId,
      paginationQueryDto,
    );

    return new TodoCollectionPresenter(items, total).toJSON();
  }

  /***
   Create new todo
   */
  @Post()
  async createTodo(@Req() req: any, @Body() createTodoDto: CreateTodoDto) {
    const newTodo: TodoDocument = await this.todoService.store(
      req.user.userId,
      createTodoDto,
    );

    return new TodoPresenter(newTodo).toJSON();
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
    const updatedTodo: TodoDocument | null = await this.todoService.update(
      todoId,
      updateTodoDto,
    );
    if (!updatedTodo) {
      throw new NotFoundException('Something went wrong');
    }

    return new TodoPresenter(updatedTodo).toJSON();
  }
  /***
   Mark as completed
   */
  @Patch('mark-as-completed/:id')
  async markCompleted(@Param('id') taskId: string) {
    const completedTodo = await this.todoService.markAsCompleted(taskId);
    if (!completedTodo) {
      throw new NotFoundException('Something went wrong');
    }

    return new TodoPresenter(completedTodo).toJSON();
  }

  /***
   Get todo details
   */
  @Delete(':id')
  async delete(@Param('id') todoId: string) {
    return await this.todoService.delete(todoId);
  }
}
