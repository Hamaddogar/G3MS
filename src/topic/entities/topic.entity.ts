import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: false })
export class Topic {
  @Prop()
  topic: string;

  @Prop()
  cmsId: number;
}
export const TopicSchema = SchemaFactory.createForClass(Topic);
