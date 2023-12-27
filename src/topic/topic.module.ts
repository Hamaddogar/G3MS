import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TopicSchema } from './entities/topic.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Topic', schema: TopicSchema }]),
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
