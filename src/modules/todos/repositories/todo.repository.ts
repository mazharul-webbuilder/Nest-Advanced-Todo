import { FilterQuery, Model, Types } from 'mongoose';
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

  async create(userId: string, data: Partial<Todo>): Promise<TodoDocument> {
    data.user = new Types.ObjectId(userId);
    return await this.model.create(data);
  }

  async findAll(userId: string, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    // 1. Convert string to ObjectId
    const filter: FilterQuery<TodoDocument> = {
      user: new Types.ObjectId(userId),
    };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      // 2. Pass the filter here too, otherwise you count every user's todos
      this.model.countDocuments(filter),
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
