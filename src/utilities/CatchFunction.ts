import { Injectable } from '@nestjs/common';
import { ServerResponse } from 'src/models';

const execute = async <T>(fn: () => ServerResponse<T>): ServerResponse<T> => {
  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      return {
        status: 400,
        message: error.message,
      };
    else
      return {
        status: 500,
        message: 'Internal server error',
      };
  }
};

@Injectable()
export class CatchFunction {
  execute = execute;
}
