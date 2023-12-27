import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Topic } from '../../topic/entities/topic.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  type: string;

  @Prop()
  username: string;

  @Prop()
  fullname: string;

  @Prop()
  email: string;

  @Prop()
  DOB: Date;

  @Prop()
  grade: string;

  @Prop()
  ageGroup: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' })
  public topic: Topic;

  @Prop()
  public parentId: string;

  @Prop()
  public profileImage: string;

  @Prop({ default: 0 })
  public followers: number;

  @Prop({ default: 0 })
  public following: number;

  @Prop({ default: 9 })
  public lastQuizTime: number;

  @Prop({ default: 0 })
  public gemsToken: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(paginate);
UserSchema.index({ username: 1 }, { unique: true });
