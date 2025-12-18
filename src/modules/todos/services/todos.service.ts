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
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { TodoDocument } from '../../../database/mongoose/schemas/todo.schema';

@Injectable()
export class TodosService {
  constructor(
    @Inject('TodoRepositoryInterface')
    private readonly repo: TodoRepositoryInterface,
  ) {}

  async getTodos(userId: string, paginationQueryDto: PaginationQueryDto) {
    const { page, limit, search } = paginationQueryDto;

    return await this.repo.findAll(userId, page, limit, search);
  }

  async store(userId: string, createTodoDto: CreateTodoDto) {
    return await this.repo.create(userId, createTodoDto);
  }

  async details(userId: string, todoId: string): Promise<TodoDocument> {
    const todo = await this.repo.findById(userId, todoId);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }
    return todo;
  }
  async update(userId: string, todoId: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.details(userId, todoId);

    if (todo.status === TodoStatus.COMPLETED) {
      throw new BadRequestException(`Cannot update a completed todo`);
    }

    return await this.repo.update(todoId, updateTodoDto);
  }

  async delete(userId: string, todoId: string) {
    await this.details(userId, todoId);
    return await this.repo.delete(todoId);
  }

  async markAsCompleted(userId: string, taskId: string) {
    const todo = await this.details(userId, taskId);
    if (todo.status === TodoStatus.COMPLETED) {
      throw new BadRequestException(`Cannot update a completed todo`);
    }
    return await this.repo.markAsCompleted(taskId);
  }
}
