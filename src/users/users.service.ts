import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reader, ReaderDocument } from 'src/models/reader.model';
import { JwtService } from '@nestjs/jwt';
import { Role, User, UserDto } from 'src/models';

export interface UserResponse {
  token: string;
  user: Omit<UserDto, 'password'>;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Reader.name) private readerModel: Model<Reader>,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(email: string): Promise<ReaderDocument | null> {
    let user = null;
    user = await this.readerModel.findOne({ email }).exec();
    if (user) return user;
    user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async editUser(userId: string, payload: Partial<UserDto>, auth: string) {
    const tokenHeader = auth.split(' ')[1];
    const tokenPayload = this.jwtService.decode(tokenHeader);
    if (!tokenPayload || typeof tokenPayload === 'string')
      throw new UnauthorizedException();
    const { _id } = tokenPayload;
    if (_id !== userId) throw new UnauthorizedException();
    console.log(payload);
    const user = await this.userModel.findByIdAndUpdate(userId, { ...payload });
    if (!user) throw new Error('User not found');
    const { password, ...saveUser } = user.toObject();
    const userToSend = { ...saveUser, ...payload };
    const token = await this.jwtService.signAsync({ _id: user._id });
    return {
      token,
      user: userToSend,
    };
  }

  async upgradeReaderToUser(
    readerId: string,
    userComplement: Partial<UserDto>,
    auth: string,
  ) {
    const tokenHeader = auth.split(' ')[1];
    const payload = this.jwtService.decode(tokenHeader);
    if (!payload || typeof payload === 'string')
      throw new UnauthorizedException();
    const { _id } = payload;
    if (_id !== readerId) throw new UnauthorizedException();
    const reader = await this.readerModel.findById(readerId).exec();
    if (!reader) throw new Error('Reader not found');
    const readerData = reader.toObject();
    const user = new this.userModel({
      ...readerData,
      ...userComplement,
      role: Role.USER,
    });
    await user.save();
    await this.readerModel.findByIdAndDelete(readerId).exec();
    const { password, ...saveUser } = user.toObject();
    const token = await this.jwtService.signAsync({ _id: user._id });
    return {
      token,
      user: saveUser,
    };
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) throw new Error('User not found');
    const { password, ...saveUser } = user.toObject();
    return saveUser;
  }
}
