import { IsEnum, IsISO8601, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';
import { TodoPriorityStatus } from '../../enums/todo.priority.status.enum';

export class CreateTodoDto {
  @Optional()
  userId: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsISO8601()
  dueDate: Date;
  @IsEnum(TodoPriorityStatus, { message: 'Invalid Priority value pass.' })
  priority: TodoPriorityStatus;
}
