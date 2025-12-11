import {
  Todo,
  TodoDocument,
} from '../../../../database/mongoose/schemas/todo.schema';

export interface TodoRepositoryInterface {
  create(data: Partial<Todo>): Promise<TodoDocument>;
  findAll(
    page: number,
    limit: number,
  ): Promise<{ items: TodoDocument[]; total: number }>;
  findById(id: string): Promise<TodoDocument | null>;
  update(id: string, data: Partial<Todo>): Promise<Todo | null>;
  markAsCompleted(id: string): Promise<null>;
  delete(id: string): Promise<void>;
}
