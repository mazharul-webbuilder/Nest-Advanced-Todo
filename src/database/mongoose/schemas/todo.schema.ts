import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TodoPriorityStatus } from '../../../common/enums/todo-priority.status';
import { TodoStatus } from '../../../common/enums/todo.status';

// Custom Type
export type TodoDocument = HydratedDocument<Todo> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true, versionKey: false })
export class Todo {
  @Prop({ required: true, type: String })
  title: string;
  @Prop({ required: true, type: String })
  description: string;
  @Prop({ required: true, type: Date })
  dueDate: Date;
  @Prop({ required: true, enum: TodoPriorityStatus })
  priority: TodoPriorityStatus;
  @Prop({ required: true, enum: TodoStatus, default: TodoStatus.NOT_STARTED })
  status: TodoStatus;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
