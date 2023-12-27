import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostSchema } from './entities/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
    HttpModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
