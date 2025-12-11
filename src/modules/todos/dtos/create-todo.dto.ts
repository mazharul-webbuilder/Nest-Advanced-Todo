import { TodoPriorityStatus } from '../../../common/enums/todo-priority.status';
import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsOptional()
  userId: null;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsISO8601()
  dueDate: Date;
  @IsEnum(TodoPriorityStatus, { message: 'Priority status is invalid' })
  priority: TodoPriorityStatus;
}
