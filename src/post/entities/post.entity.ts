import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Topic } from '../../topic/entities/topic.entity';
import { User } from '../../user/entities/user.entity';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop()
  type: string;

  @Prop()
  cmsId: number;

  @Prop()
  title: string;

  @Prop()
  url: string;

  @Prop()
  muxPlaybackId: string;

  @Prop()
  muxAssetId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' })
  public topic: Topic;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop()
  public templateId: string;

  @Prop()
  randomPoint: number[];
}
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ randomPoint: '2d', title: 'text' });
