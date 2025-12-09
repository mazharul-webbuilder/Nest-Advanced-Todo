import { BasePresenter } from './base.presenter';

export class TodoPresenter extends BasePresenter<any> {
  toJSON(): any {
    const { _id, title, description, status } = this.data;

    return {
      id: _id,
      title,
      description,
      status,
    };
  }
}
