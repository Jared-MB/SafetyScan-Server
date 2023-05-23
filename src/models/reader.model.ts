import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from './user.model';

export type ReaderDocument = HydratedDocument<Reader>;

@Schema({
  timestamps: false,
  versionKey: false,
})
export class Reader {
  @Prop({
    minlength: 3,
    maxlength: 100,
  })
  name: string;

  @Prop()
  password: string;

  @Prop({
    unique: true,
    minLength: 10,
    maxLength: 100,
  })
  email: string;

  @Prop()
  role: Role;

  @Prop({
    type: Number,
    min: 0,
    max: 120,
  })
  age: number;
}

export class ReaderDto {
  name: string;
  password: string;
  email: string;
}

export const ReaderSchema = SchemaFactory.createForClass(Reader);
