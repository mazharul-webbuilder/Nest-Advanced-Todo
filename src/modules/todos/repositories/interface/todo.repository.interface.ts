import { Todo } from '../../../../database/mongoose/schemas/todo.schema';

export interface TodoRepositoryInterface {
  create(data: Partial<Todo>): Promise<Todo>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ items: Todo[]; total: number }>;
  findById(id: string): Promise<Todo | null>;
  update(id: string, data: Partial<Todo>): Promise<Todo | null>;
  delete(id: string): Promise<void>;
}
