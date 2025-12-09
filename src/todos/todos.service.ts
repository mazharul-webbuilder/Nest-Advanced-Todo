import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { TodoStatus } from '../enums/todo.status.enum';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async store(requestData: CreateTodoDto) {
    const todo = new this.todoModel(requestData);
    todo.status = TodoStatus.NOT_STARTED;
    await todo.save();
    return todo;
  }

  async index() {
    return this.todoModel.find();
  }
}
