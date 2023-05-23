import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reader, Role, User } from 'src/models';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Reader.name) private readerModel: Model<Reader>,
    private jwtService: JwtService,
  ) {}

  async upgradeUserToAdmin(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      role: Role.ADMIN,
    });
    if (!user) throw new Error('User not found');
    const { password, ...saveUser } = user.toObject();
    const token = await this.jwtService.signAsync({ _id: user._id });
    return {
      token,
      user: saveUser,
    };
  }

  async deleteUser(userId: string, auth: string) {
    const token = auth.split(' ')[1];
    const payload = this.jwtService.decode(token);
    if (!payload || typeof payload === 'string')
      throw new UnauthorizedException();
    const { _id } = payload;
    console.log(payload);
    const user = await this.userModel.findById<User>(_id).exec();
    if (!user) throw new UnauthorizedException();
    if (user.role !== Role.ADMIN) throw new UnauthorizedException();
    let deletedUser = null;
    deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
    if (deletedUser) return null;
    deletedUser = await this.readerModel.findByIdAndDelete(userId).exec();
    if (!deletedUser) throw new Error('User not found');
    return null;
  }
}
