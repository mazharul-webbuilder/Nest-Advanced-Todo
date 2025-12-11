import { IsEnum, IsISO8601, IsString } from 'class-validator';
import { TodoPriorityStatus } from '../../../common/enums/todo-priority.status';
import { TodoStatus } from '../../../common/enums/todo.status';

export class UpdateTodoDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsISO8601()
  dueDate: Date;
  @IsEnum(TodoPriorityStatus, { message: 'Priority status is invalid' })
  priority: TodoPriorityStatus;
  @IsEnum(TodoStatus, { message: 'Todo Status is invalid.' })
  status: TodoStatus;
}
