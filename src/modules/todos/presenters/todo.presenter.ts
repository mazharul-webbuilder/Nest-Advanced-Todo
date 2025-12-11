import { BasePresenter } from '../../../common/presenters/base.presenter';
import { TodoEntity } from '../entities/todo.entity';
import { TodoDocument } from '../../../database/mongoose/schemas/todo.schema';

export class TodoPresenter extends BasePresenter<TodoEntity> {
  constructor(todoDoc: TodoDocument) {
    super(
      new TodoEntity({
        id: todoDoc._id.toString(),
        title: todoDoc.title,
        description: todoDoc.description,
        dueDate: todoDoc.dueDate,
        priority: todoDoc.priority,
        status: todoDoc.status,
        createdAt: todoDoc.createdAt,
        updatedAt: todoDoc.updatedAt,
      }),
    );
  }

  toJSON(): TodoEntity {
    return this.data;
  }
}
