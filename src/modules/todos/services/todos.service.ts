import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import type { TodoRepositoryInterface } from '../repositories/interface/todo.repository.interface';
import { UpdateTodoDto } from '../dtos/update-todo.dto';
import { TodoStatus } from '../../../common/enums/todo.status';

@Injectable()
export class TodosService {
  constructor(
    @Inject('TodoRepositoryInterface')
    private readonly repo: TodoRepositoryInterface,
  ) {}

  async getTodos() {
    return await this.repo.findAll(1, 1);
  }

  async store(createTodoDto: CreateTodoDto) {
    return await this.repo.create(createTodoDto);
  }

  async details(todoId: string) {
    const todo = await this.repo.findById(todoId);

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }
    return todo;
  }
  async update(todoId: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.details(todoId);

    if (todo.status === TodoStatus.COMPLETED) {
      throw new BadRequestException(`Cannot update a completed todo`);
    }

    return await this.repo.update(todoId, updateTodoDto);
  }
}
