import {
  Todo,
  TodoDocument,
} from '../../../../database/mongoose/schemas/todo.schema';

export interface TodoRepositoryInterface {
  create(userId: string, data: Partial<Todo>): Promise<TodoDocument>;
  findAll(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ items: TodoDocument[]; total: number }>;
  findById(userId: string, id: string): Promise<TodoDocument | null>;
  update(id: string, data: Partial<Todo>): Promise<TodoDocument | null>;
  markAsCompleted(id: string): Promise<TodoDocument | null>;
  delete(id: string): Promise<void>;
}
