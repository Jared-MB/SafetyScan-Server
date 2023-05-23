export type ServerResponse<T = null> = Promise<{
  status: number;
  message: string;
  data?: T;
}>;
