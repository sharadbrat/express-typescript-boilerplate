export interface IModel<T> {
  id: T;
  deletedAt?: number;
  createdAt: number;
  updatedAt: number;
}
