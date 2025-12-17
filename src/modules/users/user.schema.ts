import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from '../../constants/roles.constant';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ enum: Object.values(ROLES), default: ROLES.USER })
  role!: string;

  @Prop({ default: true })
  isActive!: boolean;

  // Soft delete fields
  @Prop({ default: false })
  isDeleted!: boolean;

 @Prop({ type: Date, default: null })
deletedAt!: Date | null;
// for forgot passwrd 
  @Prop({ type: Number, default: null })
  resetOtp: number | null | undefined;

  @Prop({ type: Date, default: null })
  resetOtpExpiry: Date | null | undefined;


}

export const UserSchema = SchemaFactory.createForClass(User);
