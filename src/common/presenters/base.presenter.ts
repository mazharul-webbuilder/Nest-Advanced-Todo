export abstract class BasePresenter<T = any> {
  protected data: T;

  constructor(data: T) {
    this.data = data;
  }

  abstract toJSON(): any;
}
