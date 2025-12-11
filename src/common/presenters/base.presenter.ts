export class BasePresenter<T = any> {
  protected data: T;

  constructor(data: T) {
    this.data = data;
  }

  toJSON(): T {
    return this.data;
  }
}
