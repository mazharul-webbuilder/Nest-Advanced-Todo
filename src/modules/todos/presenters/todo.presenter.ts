import { BasePresenter } from '../../../common/presenters/base.presenter';
import { Todo } from '../../../database/mongoose/schemas/todo.schema';

export class TodoPresenter extends BasePresenter<Todo> {
  toJSON(): Todo {
    return {
      title: this.data.title,
      description: this.data.description,
      status: this.data.status,
      dueDate: this.data.dueDate,
      priority: this.data.priority,
    };
  }
}
