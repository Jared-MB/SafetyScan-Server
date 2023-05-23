import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserResponse, UsersService } from './users.service';
import { Public } from 'src/decorators/public.decorator';
import { ReaderDto } from 'src/models/reader.model';
import { ServerResponse, UserDto } from 'src/models';
import { CatchFunction } from 'src/utilities/CatchFunction';
import { CreateReaderResponse, ReadersService } from './readers.service';
import { AdminService } from './admin.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readersService: ReadersService,
    private adminService: AdminService,
    private readonly catchFunction: CatchFunction,
  ) {}

  @Public()
  @Post('reader')
  async createReader(
    @Body() body: ReaderDto,
  ): ServerResponse<CreateReaderResponse> {
    return await this.catchFunction.execute<CreateReaderResponse>(async () => {
      const response = await this.readersService.createReader(body);
      return {
        status: 201,
        message: 'Reader created successfully',
        data: response,
      };
    });
  }

  @Put(':id')
  async updateUser(
    @Param() params: { id: string },
    @Headers() headers: { authorization: string },
    @Body() body: Partial<UserDto>,
  ): ServerResponse<UserResponse> {
    return await this.catchFunction.execute<UserResponse>(async () => {
      const { authorization } = headers;
      const response = await this.usersService.editUser(
        params.id,
        body,
        authorization,
      );
      return {
        status: 200,
        message: 'User updated successfully',
        data: response,
      };
    });
  }

  @Put('upgrade-reader-to-user/:id')
  async upgradeReaderToUser(
    @Param() params: { id: string },
    @Headers() headers: { authorization: string },
    @Body() body: Partial<UserDto>,
  ): ServerResponse<UserResponse> {
    return await this.catchFunction.execute<UserResponse>(async () => {
      const { authorization } = headers;
      const response = await this.usersService.upgradeReaderToUser(
        params.id,
        body,
        authorization,
      );
      return {
        status: 201,
        message: 'User created successfully',
        data: response,
      };
    });
  }

  @Put('upgrade-user-to-admin/:id')
  async upgradeUserToAdmin(
    @Param() params: { id: string },
  ): ServerResponse<UserResponse> {
    return await this.catchFunction.execute<UserResponse>(async () => {
      await this.adminService.upgradeUserToAdmin(params.id);
      return {
        status: 200,
        message: 'User updated successfully',
      };
    });
  }

  @Delete(':id')
  async deleteUser(
    @Param() params: { id: string },
    @Headers() headers: { authorization: string },
  ): ServerResponse {
    return await this.catchFunction.execute(async () => {
      const { authorization } = headers;
      await this.adminService.deleteUser(params.id, authorization);
      return {
        status: 200,
        message: 'User deleted successfully',
      };
    });
  }

  @Get(':id')
  async getUserById(
    @Param() params: { id: string },
  ): ServerResponse<Omit<UserDto, 'password'>> {
    return await this.catchFunction.execute<Omit<UserDto, 'password'>>(
      async () => {
        const response = await this.usersService.getUserById(params.id);
        return {
          status: 200,
          message: 'User retrieved successfully',
          data: response,
        };
      },
    );
  }
}
