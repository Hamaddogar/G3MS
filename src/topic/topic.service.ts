import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicDocument } from './entities/topic.entity';

@Injectable()
export class TopicService {
  constructor(@InjectModel('Topic') private topicModel: Model<TopicDocument>) {}
  create(createTopicDto: CreateTopicDto) {
    return this.topicModel.create(createTopicDto);
  }

  findAll() {
    return this.topicModel.find().select({ cmsId: 0 });
  }

  findOne(id: string) {
    return this.topicModel.findById(id);
  }

  update(id: string, updateTopicDto: UpdateTopicDto) {
    return this.topicModel.findByIdAndUpdate(id, updateTopicDto);
  }

  remove(id: string) {
    return this.topicModel.findByIdAndRemove(id);
  }
}
