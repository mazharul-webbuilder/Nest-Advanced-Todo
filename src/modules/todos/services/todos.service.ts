import { Inject, Injectable } from '@nestjs/common';
import { CreateTodoDto } from '../dtos/create-todo.dto';
import type { TodoRepositoryInterface } from '../repositories/interface/todo.repository.interface';

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
    return await this.repo.findById(todoId);
  }
}
