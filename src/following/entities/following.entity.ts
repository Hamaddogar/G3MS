import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.entity';

export type FollowingDocument = Following & Document;

@Schema({ timestamps: true })
export class Following {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public follower: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public followee: User;
}
export const FollowingSchema = SchemaFactory.createForClass(Following);
