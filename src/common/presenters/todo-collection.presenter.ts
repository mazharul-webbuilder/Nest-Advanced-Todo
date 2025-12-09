import { BasePresenter } from './base.presenter';
import { TodoPresenter } from './todo.presenter';

export class TodoCollectionPresenter extends BasePresenter<any[]> {
  private meta: any;

  constructor(data: any[], meta?: any) {
    super(data);
    this.meta = meta;
  }

  toJSON() {
    return {
      data: this.data.map((todo) => new TodoPresenter(todo).toJSON()),
      meta: this.meta ?? null,
    };
  }
}
