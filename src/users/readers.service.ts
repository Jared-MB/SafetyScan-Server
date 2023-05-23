import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reader, ReaderDto, Role } from 'src/models';
import * as bcrypt from 'bcryptjs';

export interface CreateReaderResponse {
  token: string;
  reader: Omit<ReaderDto, 'password'>;
}

@Injectable()
export class ReadersService {
  constructor(
    @InjectModel(Reader.name) private readerModel: Model<Reader>,
    private jwtService: JwtService,
  ) {}

  async createReader(reader: ReaderDto): Promise<CreateReaderResponse> {
    const readerObj = { ...reader, role: Role.READER };
    const createdReader = new this.readerModel(readerObj);
    const saltRounds = 10;
    createdReader.password = await bcrypt.hash(
      createdReader.password,
      saltRounds,
    );
    await createdReader.save();
    const { password, ...saveReader } = createdReader.toObject();
    const token = await this.jwtService.signAsync({ _id: createdReader._id });
    return {
      token,
      reader: saveReader,
    };
  }
}
