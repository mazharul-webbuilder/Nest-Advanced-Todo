import { TodoPriorityStatus } from '../../../common/enums/todo-priority.status';
import { TodoStatus } from '../../../common/enums/todo.status';

export class TodoEntity {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TodoPriorityStatus;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TodoEntity>) {
    Object.assign(this, partial);
  }
}
