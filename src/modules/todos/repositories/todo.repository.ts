import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  Todo,
  TodoDocument,
} from '../../../database/mongoose/schemas/todo.schema';
import { TodoRepositoryInterface } from './interface/todo.repository.interface';
import { TodoStatus } from '../../../common/enums/todo.status';

@Injectable()
export class TodoRepository implements TodoRepositoryInterface {
  constructor(
    @InjectModel(Todo.name)
    private readonly model: Model<TodoDocument>,
  ) {}

  async create(data: Partial<Todo>): Promise<TodoDocument> {
    return await this.model.create(data);
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.model.countDocuments(),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<TodoDocument | null> {
    return this.model.findById(id);
  }

  async update(id: string, data: Partial<Todo>): Promise<TodoDocument | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }
  markAsCompleted(id: string): Promise<null> {
    return this.model.findByIdAndUpdate(id, { status: TodoStatus.COMPLETED });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
