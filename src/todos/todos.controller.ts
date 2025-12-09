import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosService } from './todos.service';
import { TodoPresenter } from '../common/presenters/todo.presenter';
import { TodoCollectionPresenter } from '../common/presenters/todo-collection.presenter';

@Controller('todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}
  @Get()
  getTodos() {
    console.log('fuck');
    const todos = await this.todoService.index();
    const meta = { total: todos.length, perPage: 10, currentPage: 1 };
    return new TodoCollectionPresenter(todos, meta);
  }
  @Post()
  async createTodo(@Body() requestData: CreateTodoDto) {
    const todo = await this.todoService.store(requestData);
    return {
      message: 'Todo created successfully',
      data: new TodoPresenter(todo),
    };
  }
}
