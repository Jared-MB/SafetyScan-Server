import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { CatchFunction } from 'src/utilities/CatchFunction';
import { User, Reader, ReaderSchema, UserSchema } from 'src/models';
import { ReadersService } from './readers.service';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Reader.name,
        schema: ReaderSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersService, CatchFunction, ReadersService, AdminService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
