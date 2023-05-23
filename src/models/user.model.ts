import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReaderDto } from './reader.model';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type SexType = 'male' | 'female';

export enum Role {
  READER = 'reader',
  USER = 'user',
  ADMIN = 'admin',
}

export interface SignInDto {
  email: string;
  password: string;
}

@Schema({
  timestamps: false,
  versionKey: false,
})
class EmergencyContact {
  @Prop()
  name: string;

  @Prop()
  relationship: string;

  @Prop({
    type: Number,
    minlength: 10,
  })
  phone: number;
}

const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: false,
  versionKey: false,
})
export class User {
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

  @Prop({
    enum: ['male', 'female'],
  })
  sex: SexType;

  @Prop({
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  })
  bloodType: BloodType;

  @Prop({
    required: false,
  })
  allergies: string[];

  @Prop({
    required: false,
  })
  medicalConditions: string[];

  @Prop({
    required: false,
  })
  disabilities: string;

  @Prop({
    required: false,
    type: [EmergencyContactSchema],
  })
  emergencyContacts: [EmergencyContact];

  @Prop()
  address: string;
}

export interface UserDto extends ReaderDto {
  age: number;
  sex: string;
  bloodType: string;
  allergies?: string[];
  medicalConditions?: string[];
  disabilities?: string;
  emergencyContacts?: EmergencyContact[];
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
