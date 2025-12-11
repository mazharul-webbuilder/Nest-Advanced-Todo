import { TodoPresenter } from './todo.presenter';
import { TodoDocument } from '../../../database/mongoose/schemas/todo.schema';

interface TodoCollection {
  items: any[];
  total: number;
}

export class TodoCollectionPresenter {
  private data: TodoDocument[];
  private total: number;

  constructor(todos: TodoDocument[], total: number) {
    this.data = todos;
    this.total = total;
  }

  toJSON(): TodoCollection {
    return {
      items: this.data.map((todoDoc) => new TodoPresenter(todoDoc).toJSON()),
      total: this.total,
    };
  }
}
