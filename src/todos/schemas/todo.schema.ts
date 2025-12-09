import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TodoPriorityStatus } from '../../enums/todo.priority.status.enum';
import { TodoStatus } from '../../enums/todo.status.enum';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({ timestamps: true, versionKey: false })
export class Todo {
  // @Prop({ required: false })
  // userId: null;
  @Prop({ required: true, type: String })
  title: string;
  @Prop({ required: true, type: String })
  description: string;
  @Prop({ required: true, type: Date })
  dueDate: Date;
  @Prop({ required: true, enum: TodoPriorityStatus })
  priority: TodoPriorityStatus;
  @Prop({ required: true, enum: TodoStatus })
  status: TodoStatus;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
